import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function Profile() {
  const [grados, setGrados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/grados")
      .then((response) => response.json())
      .then((data) => setGrados(data))
      .catch((error) => console.error("Error fetching grados:", error));
  }, []);

  const actualizarVacante = async (id, nuevaVacante) => {
    try {
      const response = await fetch(`http://localhost:5000/api/grados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vacante: nuevaVacante }),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar vacantes");
      }
  
      const data = await response.json();
      
      // Actualizar estado con la nueva cantidad de vacantes
      setGrados((prevGrados) =>
        prevGrados.map((grado) =>
          grado._id === id ? { ...grado, vacante: data.vacante } : grado
        )
      );
  
    } catch (error) {
      console.error("Error actualizando vacantes:", error);
    }
  };
  

  return (
    <Card className="mx-3 mb-6 lg:mx-4 border border-blue-gray-100 mt-8">
      <CardBody className="p-9">
        <Typography variant="h6" color="blue-gray" className="mb-2">
          Vacantes
        </Typography>
        <Typography variant="small" className="font-normal text-blue-gray-500">
          Vacantes disponibles por grado
        </Typography>
        <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
          {grados.map(({ _id, nombre, vacante, nivel }) => (
            <Card key={_id} color="transparent" shadow={false} className="flex flex-col justify-between">
              <CardHeader floated={false} color="gray" className="mx-0 mt-0 mb-4 h-64 xl:h-40">
                <img
                  src="/img/inicial.jpg" // Imagen de respaldo
                  alt={nombre}
                  className="h-full w-full"
                />
              </CardHeader>
              <div className="flex justify-between items-center px-1">
                <CardBody className="py-0">
                  <Typography variant="small" className="font-normal text-blue-gray-500">
                    {nivel}
                  </Typography>
                  <Typography variant="h5" color="blue-gray" className="mt-1 mb-2">
                    {nombre}
                  </Typography>
                  <Input
                    type="number"
                    value={vacante}
                    onChange={(e) => {
                      const nuevoValor = parseInt(e.target.value, 10);
                      setGrados((prevGrados) =>
                        prevGrados.map((grado) =>
                          grado._id === _id ? { ...grado, vacante: nuevoValor } : grado
                        )
                      );
                    }}
                  />
                </CardBody>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => actualizarVacante(_id, grados.find((g) => g._id === _id).vacante)}
                >
                  Guardar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default Profile;
