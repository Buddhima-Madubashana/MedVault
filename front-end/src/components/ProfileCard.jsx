const PatientCard = (props) => {
  return (
    <div>
      <img src={props.pic} alt="Patient Image" />
      <h1>{props.name}</h1>
      <h3>{props.detail} Patient</h3>
    </div>
  );
};

export default PatientCard;
