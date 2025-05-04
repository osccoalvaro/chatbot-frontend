import { useEffect, useState } from "react";
import { Card, CardBody, Typography, Tooltip,   
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar } from "@material-tailwind/react";
import {PencilIcon ,  UserCircleIcon,
  
  BellIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";

export function Tables() {
  const [apoderados, setApoderados] = useState([]);
  const [selectedApoderado, setSelectedApoderado] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Estado para manejar el popup de la imagen

  useEffect(() => {
    fetch("http://localhost:5000/api/apoderados")
      .then((response) => response.json())
      .then((data) => setApoderados(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSelectApoderado = (apoderadoId, index) => {
    if (selectedApoderado === apoderadoId && showStudents === index) {
      setShowStudents(null);
    } else {
      setSelectedApoderado(apoderadoId);
      setShowStudents(index);
      fetch(`http://localhost:5000/api/apoderados/${apoderadoId}/estudiantes`)
        .then((response) => response.json())
        .then((data) => setStudents(data))
        .catch((error) => console.error("Error fetching students:", error));
    }
  };

  // Función para abrir el popup con la imagen seleccionada
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const actualizarEstado = async (idEstudiante, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/estudiantes/${idEstudiante}/estadoAdmision`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estadoAdmision: nuevoEstado }),
      });
  
      if (!response.ok) throw new Error('No se pudo actualizar el estado');
  
      const estudianteActualizado = await response.json();
      console.log('Estudiante actualizado:', estudianteActualizado);
  
      // Actualiza el estado local
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === idEstudiante ? { ...student, estadoAdmision: nuevoEstado } : student
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };
  

  // Función para cerrar el popup
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nro doc.", "Nombres", "Apellido Paterno", "Apellido Materno", "Correo", "Teléfono", "Fecha Registro", "Imagen doc.", ""].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-6 px-5 text-left">
                    <Typography variant="small" className="text-xs font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apoderados.map(({ dni, nombre, apellidoPaterno, apellidoMaterno, correo, telefono, fecha, imagen, _id }, key) => {
                const className = `py-1 px-5 ${key === apoderados.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <>
                    <tr key={dni} onClick={() => handleSelectApoderado(_id, key)} className="cursor-pointer">
                      
                    <td className={className}>

<div className="flex items-center gap-2">
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-6 h-6 transition-transform duration-200 ${showStudents === key ? "rotate-90" : ""}`}
  >
    <path
      fillRule="evenodd"
      d="M10.293 16.293a1 1 0 010-1.414L13.586 12 10.293 8.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
  <Typography variant="small" color="blue-gray" className="font-semibold">
    {dni}
  </Typography>
</div>
</td>
                      <td className={className}>
                        <Typography className="text-sm font-normal text-blue-gray-600">{nombre}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-normal text-blue-gray-600">{apellidoPaterno}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-normal text-blue-gray-600">{apellidoMaterno}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-normal text-blue-gray-500">{correo}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-normal text-blue-gray-500">{telefono}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-normal text-blue-gray-500">{new Date(fecha).toLocaleDateString()}</Typography>
                      </td>
                      <td className={className}>
                        <img
                            src="/img/dni.png"
                          alt="Imagen Apoderado"
                          className="w-16 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(`http://localhost:5000/api/images/${imagen}`);
                          }}
                        />
            

                      </td>
                      <td className={className}>
                        <Tooltip content="Edit Apoderado">
                  <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                </Tooltip>
                      </td>
                    </tr>

                    {showStudents === key && students.length > 0 && (
                      <>
                        <tr>
                          {["Nro doc.", "Nombres", "Apellido Paterno", "Apellido Materno", "Grado", "Imagen doc.", "Libreta", "Admisión"].map((header) => (
                            <th key={header} className="py-2 px-5 text-left text-xs font-bold uppercase text-blue-gray-500">
                              {header}
                            </th>
                          ))}
                          <th colSpan={5}></th>
                        </tr>
                        {students.map(({ dni, nombre, apellidoPaterno, apellidoMaterno, grado, imagen, imagenLibreta, estadoAdmision, pagoMatricula, _id }, key) => (
                          <tr key={_id}>
                            <td className="py-1 px-5">
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {dni}
                              </Typography>
                            </td>
                            <td className="py-1 px-5">
                              <Typography className="text-sm font-normal text-blue-gray-600">{nombre}</Typography>
                            </td>
                            <td className="py-1 px-5">
                              <Typography className="text-sm font-normal text-blue-gray-600">{apellidoPaterno}</Typography>
                            </td>
                            <td className="py-1 px-5">
                              <Typography className="text-sm font-normal text-blue-gray-600">{apellidoMaterno}</Typography>
                            </td>
                            <td className="py-1 px-5">
                              <Typography className="text-sm font-normal text-blue-gray-600">{grado}</Typography>
                            </td>                            

<td className={className}>
                        <img
                           src="/img/dni-estudiante.png"
                          alt="Foto DNI Estudiante"
                          className="w-16 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(`http://localhost:5000/api/images/${imagen}`);
                          }}
                        />
                      </td>

                      <td className={className}>
                        <img
                           src="/img/libreta.png"
                          alt="Foto DNI Estudiante"
                          className="w-11 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(`http://localhost:5000/api/images/${imagenLibreta}`);
                          }}
                        />
                      </td>
                      <td className="py-1 px-5">
                      <Typography className={`text-sm font-normal ${pagoMatricula ? "text-green-600" : "text-red-600"}`}>
                        {pagoMatricula ? "Pagado" : "Por pagar"}
                      </Typography>
       
                              <Typography className="text-sm font-normal text-blue-gray-600">  {estadoAdmision}</Typography>

                              
                              <Menu>
  <MenuHandler>
    <IconButton variant="text" color="blue-gray">
      <BellIcon className="h-5 w-5 text-blue-gray-500" />
    </IconButton>
  </MenuHandler>
  <MenuList className="w-max border-0">
 
    <MenuItem
      className="flex items-center gap-4"
      onClick={() => actualizarEstado(_id, "Admitido")}
    >
      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
        <CreditCardIcon className="h-4 w-4 text-white" />
      </div>
      <div>
        <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
        Admitido
        </Typography>
      </div>
    </MenuItem>
    <MenuItem
      className="flex items-center gap-4"
      onClick={() => actualizarEstado(_id, "Observado")}
    >
      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
        <CreditCardIcon className="h-4 w-4 text-white" />
      </div>
      <div>
        <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
        Observado
        </Typography>
      </div>
    </MenuItem>
  </MenuList>
</Menu>

                            </td>

                            <td className="py-1 px-5" colSpan={5}></td>
                          </tr>
                        ))}
                      </>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Modal para la imagen */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <img src={selectedImage} alt="Imagen en grande" className="max-w-3xl max-h-[80vh] rounded-lg shadow-lg" />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
            >
<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tables;
