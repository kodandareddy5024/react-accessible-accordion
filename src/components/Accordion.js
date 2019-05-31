import React, {
  useRef,
  createContext,
  useContext,
  useState,
  useMemo
} from "react";
import PropTypes from "prop-types";
import styles from "./Accordion.module.css";
import { styled } from "./moduledComponent";

const AccordionContext = createContext({
  focusRef: {},
  selected: null,
  expandedAll: {},
  onToggle: undefined
});
export const useAccordionContext = () => useContext(AccordionContext);

const AccordionContent = styled("AccordionContent", styles);

/**
 * Accordion according to Accordion Design Pattern in WAI-ARIA Authoring Practices 1.1
 * see https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
 *
 * Keyboard Support:
 *
```
Space or Enter
  👍 When focus is on the accordion header of a collapsed section, expands the section.
Tab
  👍 Moves focus to the next focusable element.
  👍 All focusable elements in the accordion are included in the page Tab sequence.
Shift + Tab
  👍 Moves focus to the previous focusable element.
  👍 All focusable elements in the accordion are included in the page Tab sequence.
Down Arrow
  👍 When focus is on an accordion header, moves focus to the next accordion header.
  👍 When focus is on last accordion header, moves focus to first accordion header.
Up Arrow
  👍 When focus is on an accordion header, moves focus to the previous accordion header.
  👍 When focus is on first accordion header, moves focus to last accordion header.
Home
  👍 When focus is on an accordion header, moves focus to the first accordion header.
End
  👍 When focus is on an accordion header, moves focus to the last accordion header.
```
 */
export const Accordion = ({ children, expanded, onToggle }) => {
  const focusRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const context = useMemo(
    () => ({
      focusRef,
      selected,
      expandedAll: expanded,
      onToggle
    }),
    [selected, expanded, onToggle]
  );

  if (process.env.NODE_ENV === "development") {
    const uniqueIds = new Set();
    React.Children.forEach(children, child => {
      if (uniqueIds.has(child.props.id)) {
        console.warn(
          `AccordionSection id param should be unique, found duplicate key: ${
            child.props.id
          }`
        );
      } else {
        uniqueIds.add(child.props.id);
      }
    });
  }

  return (
    <AccordionContent
      onKeyDown={e => {
        switch (e.key) {
          case "ArrowDown":
            {
              const ids = React.Children.map(children, child => child.props.id);
              const index = ids.findIndex(x => x === focusRef.current);
              if (index >= ids.length - 1) {
                setSelected(ids[0]);
              } else {
                setSelected(ids[index + 1]);
              }
            }
            break;
          case "ArrowUp":
            {
              const ids = React.Children.map(children, child => child.props.id);
              const index = ids.findIndex(x => x === focusRef.current);
              if (index <= 0) {
                setSelected(ids[ids.length - 1]);
              } else {
                setSelected(ids[index - 1]);
              }
            }
            break;
          case "Home":
            {
              const ids = React.Children.map(children, child => child.props.id);
              setSelected(ids[0]);
            }
            break;
          case "End":
            {
              const ids = React.Children.map(children, child => child.props.id);
              setSelected(ids[ids.length - 1]);
            }
            break;
          default:
        }
      }}
    >
      <AccordionContext.Provider value={context}>
        {children}
      </AccordionContext.Provider>
    </AccordionContent>
  );
};

Accordion.propTypes = {
  expanded: PropTypes.objectOf(PropTypes.bool),
  onToggle: PropTypes.func
};

Accordion.defaultProps = {
  expanded: {}
};
