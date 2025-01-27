import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";

export function Tables() {
  const [apoderados, setApoderados] = useState([]);

  useEffect(() => {
    // Obtén los datos de la API
    fetch('http://localhost:5000/api/apoderados')
      .then(response => response.json())
      .then(data => setApoderados(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
       
        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nro doc.", "Nombres", "Apellido Paterno", "Apellido Materno", "Correo", "Teléfono", "Fecha", "Imagen", ""].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-6 px-5 text-left">
                    <Typography variant="small" className="text-xs font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apoderados.map(({ dni, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, fecha, imagen }, key) => {
                const className = `py-1 px-5 ${key === apoderados.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                
                return (
                  <tr key={dni}>
                    <td className={className}>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {dni}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-normal text-blue-gray-600">
                        {nombre}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-normal text-blue-gray-600">
                        {apellidoPaterno}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-normal text-blue-gray-600">
                        {apellidoMaterno}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-normal text-blue-gray-500">
                        {correo}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-normal text-blue-gray-500">
                        {telefono}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-normal text-blue-gray-500">
                        {new Date(fecha).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className={className}>
                      
                      {/* Mostrar la imagen */}
                      <img 
                        src={`http://localhost:5000/api/images/${imagen}`} 
                        alt="Imagen Apoderado" 
                        className="w-16 h-16 object-cover rounded-full"
                      />

                    </td>
                    <td className={className}>
                      <Typography as="a" href="#" className="text-xs font-semibold text-blue-gray-600">
                        Edit
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
