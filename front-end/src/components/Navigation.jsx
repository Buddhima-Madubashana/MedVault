const NavigationBar = (props) => {
  return (
    <nav className="flex justify-between font-bold text-white cursor-pointer p-7 bg-slate-900">
      <div>
        <h1>MedVault</h1>
      </div>
      <ul className="flex justify-around gap-10">
        <li>{props.nav1}</li>
        <li>{props.nav2}</li>
        <li>{props.nav3}</li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
