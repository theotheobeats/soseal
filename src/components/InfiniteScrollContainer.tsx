import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReach: () => void;
  className?: string;
}

import React from "react";

const InfiniteScrollContainer = ({
  children,
  onBottomReach,
  className,
}: InfiniteScrollContainerProps) => {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReach();
      }
    },
  });
  return (
    <div className={className}>
      {children} <div ref={ref} />
    </div>
  );
};

export default InfiniteScrollContainer;
