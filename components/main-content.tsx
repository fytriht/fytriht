import React from "react";
import styles from "./main-content.module.css";
import cx from "../common/class-name";

export interface MainContentProps {
  content: React.ReactElement;
}

const MainContent: React.SFC<MainContentProps> = ({ content }) => {
  return (
    <>
      {React.cloneElement(content, {
        className: cx(content.props.className, styles.content),
      })}
    </>
  );
};

export default MainContent;
