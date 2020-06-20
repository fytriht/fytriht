import got, { Got } from "got";
import assert from "assert";

const USER_ID = process.env.DOUBAN_USER_ID;
assert(USER_ID !== undefined);

const COOKIE = process.env.DOUBAN_COOKIE;
assert(COOKIE !== undefined);

interface GetInterestsQuery {
  start: number;
  count: number;
}

enum SubjectType {
  Movie = "movie",
  Book = "book",
  TV = "tv",
  Music = "music",
  Drama = "drama",
}

interface Subject {
  title: string;
  type: SubjectType;
  year?: string; // movies only
  pubdate?: string[]; // books only
}

interface Rating {
  count: number;
  max: number;
  star_count: number;
  value: number;
}

interface Interest {
  rating: Rating | null;
  create_time: string;
  subject: Subject;
}

interface GetInterestsResponse {
  count: number;
  start: number;
  total: number;
  interests: Interest[];
}

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

class DoubanClient {
  api: Got;

  constructor() {
    this.api = got.extend({
      headers: {
        cookie: COOKIE,
        Referer: "https://m.douban.com/mine/movie",
      },
    });
  }

  public async fetchAllInterests() {
    let currStart = 0;
    let currTotol = Number.MAX_SAFE_INTEGER;
    let count = 50;
    let ret: Interest[] = [];
    while (currStart <= currTotol) {
      const { start, total, interests } = await this.fetchInterests(USER_ID!, {
        start: currStart,
        count,
      });
      console.log("got res: ", { start, total }, interests.length);
      ret.push(...interests);
      currStart = start + count;
      currTotol = total;
      await delay(1000);
      break
    }
    return ret;
  }

  private async fetchInterests(
    userId: string,
    { start, count }: GetInterestsQuery
  ): Promise<GetInterestsResponse> {
    const searchParams = new URLSearchParams([
      ["status", "done"],
      ["start", String(start)],
      ["count", String(count)],
    ]).toString();

    const res = await this.api(
      `https://m.douban.com/rexxar/api/v2/user/${userId}/interests`,
      { searchParams: searchParams, responseType: "json" }
    );
    return res.body as GetInterestsResponse;
  }
}

// subject type as interest type
// tv -> movie
enum InterestType {
  Movie = "movie",
  Book = "book",
}

export interface OutputInterestStruct {
  title: string;
  year: string;
  create_time: string;
  type: InterestType;
  rating?: {
    value: number;
    max: number;
  };
}

class OutputInterestBuilder {
  constructor(private interests: Interest[]) {}

  static of(interests: Interest[]) {
    return new OutputInterestBuilder(interests);
  }

  filterMoviesAndBooks(): this {
    this.interests = this.interests.filter((i) =>
      [SubjectType.Movie, SubjectType.Book, SubjectType.TV].includes(
        i.subject.type
      )
    );
    return this;
  }

  build(): OutputInterestStruct[] {
    return this.interests.map(this.toOutputStruct, this);
  }

  private subjectTypeToInterestType(t: SubjectType): InterestType {
    return t === SubjectType.TV
      ? InterestType.Movie
      : ((t as any) as InterestType);
  }

  private getYear(s: Subject) {
    if (s.year !== undefined) {
      return s.year;
    }
    let date = s.pubdate![0];
    if (date === undefined) {
      return "";
    }
    return date.split("-")[0];
  }

  private toOutputStruct(i: Interest): OutputInterestStruct {
    return {
      title: i.subject.title,
      create_time: i.create_time,
      year: this.getYear(i.subject),
      type: this.subjectTypeToInterestType(i.subject.type),
      rating:
        i.rating === null
          ? null
          : {
              value: i.rating.value,
              max: i.rating.max,
            },
    } as OutputInterestStruct;
  }
}

const genDoubanStat = async () => {
  if (process.env.NODE_ENV === "development") {
    return (await import("./test_douban_stat.json")).default;
  }

  const doubanClient = new DoubanClient();
  const interests = await doubanClient.fetchAllInterests();
  return OutputInterestBuilder.of(interests).filterMoviesAndBooks().build();
};

export default genDoubanStat;
