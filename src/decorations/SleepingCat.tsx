import "./SleepingCat.css";

export function SleepingCat() {
  return (
    <div className="sleeping-cat" aria-hidden="true">
      <div className="cat">
        <div className="cat-tail" />
        <div className="cat-body" />
        <div className="cat-head">
          <div className="cat-ear cat-ear-left" />
          <div className="cat-ear cat-ear-right" />
          <div className="cat-face">
            <div className="cat-eye cat-eye-left" />
            <div className="cat-eye cat-eye-right" />
            <div className="cat-nose" />
            <div className="cat-whisker cat-whisker-left" />
            <div className="cat-whisker cat-whisker-right" />
          </div>
        </div>
        <div className="cat-hands cat-hand-left" />
        <div className="cat-hands cat-hand-right" />
      </div>
      <div className="cat-zzz">
        <span className="zzz zzz-1">z</span>
        <span className="zzz zzz-2">z</span>
        <span className="zzz zzz-3">z</span>
      </div>
    </div>
  );
}
