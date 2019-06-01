import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./AccordionSection.module.css";
import { useAccordionContext } from "./Accordion";

export const AccordionSection = ({ children, title, index }) => {
  const {
    focusRef,
    selected,
    expandedAll,
    onToggle,
    onNavigation,
    id
  } = useAccordionContext();
  const sectionId = `section-${id}-${index}`;
  const labelId = `label-${id}-${index}`;
  const expanded = expandedAll[index];
  const labelRef = useRef();
  useEffect(() => {
    if (index === selected && labelRef.current) {
      labelRef.current.focus();
    }
  }, [index, selected]);

  return (
    <>
      <div
        role="button"
        aria-expanded={expanded}
        aria-controls={sectionId}
        id={labelId}
        tabIndex={0}
        className={styles.Label}
        onClick={() => onToggle && onToggle(index)}
        onKeyDown={e => {
          switch (e.key) {
            case " ":
            case "Enter":
              e.preventDefault();
              onToggle && onToggle(index);
              break;
            case "ArrowDown":
              e.preventDefault();
              onNavigation("ArrowDown");
              break;
            case "ArrowUp":
              e.preventDefault();
              onNavigation("ArrowUp");
              break;
            case "Home":
              e.preventDefault();
              onNavigation("Home");
              break;
            case "End":
              e.preventDefault();
              onNavigation("End");
              break;
            default:
          }
        }}
        onFocus={() => {
          focusRef.current = index;
        }}
        onBlur={() => {
          focusRef.current = null;
        }}
        ref={labelRef}
      >
        {title}
        <span aria-hidden={true}>{expanded ? "▲" : "▼"}</span>
      </div>
      <div
        role="region"
        aria-labelledby={labelId}
        id={sectionId}
        hidden={!expanded}
        className={styles.Panel}
      >
        {expanded && children}
      </div>
    </>
  );
};

AccordionSection.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string.isRequired
};
