import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PageClient = () => {
  const { idEtablissement } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/etablissement/${idEtablissement}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Erreur de chargement :", err));
  }, [idEtablissement]);

  if (!data) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{data.nom}</h1>
      <p>Type : {data.type}</p>
      {/* {data.type === "restaurant" && <Menu restaurant={data} />}
      {data.type === "hotel" && <ServicesHotel hotel={data} />}
      {data.type === "supermarche" && <ProduitsSupermarche supermarche={data} />} */}
    </div>
  );
};

export default PageClient;
