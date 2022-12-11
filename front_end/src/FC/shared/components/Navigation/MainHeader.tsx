import "./MainHeader.css";

export function MainHeader({ children }: { children: JSX.Element[] }) {
  return <header className="main-header">{children}</header>;
}
