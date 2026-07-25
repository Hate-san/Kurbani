// The marketplace's signature element: shares rendered as numbered ticket
// stubs, like a perforated tag. Filled/taken stubs are solid, open stubs are
// hollow. In "interactive" mode, clicking a stub sets the desired quantity.
export default function ShareStub({ total, taken, selected = 0, size = 'sm', interactive = false, onPick }) {
  const stubs = Array.from({ length: total }, (_, i) => i + 1);

  if (size === 'sm') {
    return (
      <div className="flex gap-[3px] flex-wrap">
        {stubs.map((n) => (
          <div key={n} className={`stub ${n <= taken ? 'filled' : ''}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {stubs.map((n) => {
        let cls = '';
        if (n <= taken) cls = 'taken';
        else if (n <= taken + selected) cls = 'selected';
        return (
          <button
            key={n}
            type="button"
            disabled={n <= taken || !interactive}
            className={`stub-lg ${cls}`}
            onClick={() => interactive && onPick && onPick(n - taken)}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
