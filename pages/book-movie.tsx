import stat from "../data/movie-stat.json";
import MainContent from "../components/main-content";
import Stars from "../components/stars";
import { format } from 'date-fns'

import styles from './book-movie.module.css'

export default function BookMovie() {
  const content = (
    <div className="book-movie-wrap">
      <table>
        {stat.map((i) => {
          return (
            <tr>
              <td>
                {i.title}（{i.year}）
              </td>
              <td><time className={styles.date}>{format(new Date(i.create_time), "yyyy-MM-dd")}</time></td>
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
}
