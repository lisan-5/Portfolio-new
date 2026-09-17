/**
 * The monogram from the browser tab, mirrored in the top-right corner of the
 * page. Desktop only — on smaller screens the mobile nav button sits here.
 */
export function LogoMark() {
  return (
    <a
      href="#hero"
      aria-label="Back to top"
      className="group fixed right-6 top-6 z-50 hidden lg:block"
    >
      <img
        src="/favicon.png"
        alt=""
        width={32}
        height={32}
        decoding="async"
        className="h-8 w-8 rounded-[3px] opacity-80 ring-1 ring-border transition-all duration-200 group-hover:opacity-100 group-hover:ring-cyber"
      />
    </a>
  );
}
