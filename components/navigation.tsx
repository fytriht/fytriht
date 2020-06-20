import Link from "next/link";
import styles from "./navigation.module.css";
import cx from "../common/class-name";
import { useRouter } from "next/router";

interface TagItem {
  name: string;
  anchor: string;
}

interface NavItem {
  label: string;
  path: string;
  tags?: TagItem[];
}

const navs: NavItem[] = [
  {
    label: "博客",
    path: "/posts",
  },
  {
    label: "书影音",
    path: "/book-movie",
    tags: [
      {
        name: "书",
        anchor: "books",
      },
      {
        name: "电影",
        anchor: "movies",
      },
    ],
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
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <ul className={cx(styles.navigation, styles["unset-list"])}>
      {navs.map((n, idx) => {
        return (
          <li key={idx} className={styles["nav-item"]}>
            <Link href={n.path}>
              <a>{n.label}</a>
            </Link>
            {isActive(n.path) && n.tags !== undefined && (
              <ul className={styles['tag-list']}>
                {n.tags.map((t, idx) => {
                  return <li key={idx} className={styles['tag-item']}>
                    <Link href={`${n.path}#${t.anchor}`}>
                      <a>#{t.name}</a>
                    </Link>
                  </li>;
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
