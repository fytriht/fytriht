import MainContent from "../components/main-content";
import Stars from "../components/stars";
import { format } from "date-fns";
import genDoubanStat, {
  OutputInterestStruct as Interest,
} from "../scripts/gen_douban_stat";

import styles from "./book-movie.module.css";

export interface BookMovieProps {
  stat: Interest[];
}

const BookMovie: React.SFC<BookMovieProps> = ({ stat }) => {
  const content = (
    <div className="book-movie-wrap">
      <table>
        {stat.map((i) => {
          return (
            <tr key={i.create_time}>
              <td>
                {i.title}（{i.year}）
              </td>
              <td>
                <time className={styles.date}>
                  {format(new Date(i.create_time), "yyyy-MM-dd")}
                </time>
              </td>
              {i.rating && (
                <td>
                  <Stars value={i.rating.value} />
                </td>
              )}
            </tr>
          );
        })}
      </table>
    </div>
  );

  return <MainContent content={content} />;
};

export async function getStaticProps() {
  return {
    props: {
      stat: await genDoubanStat(),
    },
  };
}

export default BookMovie;
