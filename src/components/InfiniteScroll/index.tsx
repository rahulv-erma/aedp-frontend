import { FunctionComponent, useEffect, useRef } from "react";

type Props = {
  loadMore: () => void;
  children: React.ReactNode;
  loader?: React.ReactNode;
  loading?: boolean;
};

const InfiniteScroll: FunctionComponent<Props> = ({
  loadMore,
  children,
  loader,
  loading,
}: Props) => {
  const loadMoreRef = useRef(null);
  useEffect(() => {
    const loadMoreRefCurrent = loadMoreRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });
    if (loadMoreRef?.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRefCurrent) {
        observer.unobserve(loadMoreRefCurrent);
      }
    };
  }, []);
  return (
    <div>
      {children}
      <div ref={loadMoreRef}></div>
      {loading && loader}
    </div>
  );
};

export default InfiniteScroll;
