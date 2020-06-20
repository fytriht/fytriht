import styles from "./stars.module.css";

export interface StarsProps {
  value: number;
}

const sizeOfStar = 16;

const Stars: React.SFC<StarsProps> = ({
  value,
}) => {
  return (
    <div
      className={styles["stars-wrap"]}
      style={{ width: value * sizeOfStar }}></div>
  );
};

export default Stars;
