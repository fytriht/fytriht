import Link from "next/link";
import styles from "./navigation.module.css";
import cx from "../common/class-name";

interface NavItem {
  label: string;
  path: string;
}

const navs: NavItem[] = [
  {
    label: "博客",
    path: "/posts",
  },
  {
    label: "书影音",
    path: "/book-movie",
  },
  {
    label: "照片",
    path: "/photo",
  },
  {
    label: "关于",
    path: "/about",
  },
];

export default function Navigation() {
  return (
    <ul className={cx(styles.navigation, styles["unset-list"])}>
      {navs.map((n, idx) => {
        return (
          <li key={idx} className={styles["nav-item"]}>
            <Link href={n.path}>
              <a>{n.label}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
