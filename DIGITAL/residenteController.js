const { ethers } = require('ethers'); // Importa la librería 'ethers' para interactuar con la blockchain.
const { provider } = require('../config/blockchain'); // Importa la configuración del proveedor de la blockchain desde un archivo externo.

const CONTRATO_REGISTRO_RESIDENTE_ADDRESS = '0xd747afA078e592135812DE9Dd023Fb89ABa46667'; // Dirección del contrato inteligente en la blockchain (un valor de ejemplo).

const abi = [ // Define el ABI (Interfaz Binaria de Aplicación) que describe las funciones del contrato inteligente.
    "function registrarResidente(string,string,string,uint,uint,string,string,string,string,string,uint,uint,uint) public", // Función para registrar un residente en el contrato inteligente.
    "function obtenerTodosResidenteIds() public view returns (uint[])", // Función para obtener los IDs de todos los residentes.
    "function obtenerResidente(uint) public view returns (tuple(uint id,string preNombres,string primerApellido,string segundoApellido,uint fechaNacimiento,uint fechaInscripcion,string direccion,string telefonoCelular,string fotoHash,string firmaHash,string idDigital,uint estadoCivilId,uint sexoId,uint distritoId))" // Función para obtener todos los datos de un residente dado su ID.
];

const contratoConProvider = new ethers.Contract(CONTRATO_REGISTRO_RESIDENTE_ADDRESS, abi, provider); // Crea una instancia del contrato utilizando la dirección, ABI y proveedor (para leer datos).

const PRIVATE_KEY_ADMIN = '6ea6ccc2088a17724cfe75f275e2dc618ba33659ed1cbba49dfc67bb3dcf1f42'; // Define la clave privada del administrador para firmar transacciones (un valor de ejemplo).
const signer = new ethers.Wallet(PRIVATE_KEY_ADMIN, provider); // Crea un objeto de billetera con la clave privada y lo conecta al proveedor.

async function registrarResidente(data) { // Función asíncrona que permite registrar un nuevo residente.
    try {
        const { // Desestructura los datos recibidos para ser utilizados en el registro del residente.
            preNombres,
            primerApellido,
            segundoApellido,
            fechaNacimiento,
            fechaInscripcion,
            direccion,
            telefonoCelular,
            fotoHash,
            firmaHash,
            idDigital,
            estadoCivilId,
            sexoId,
            distritoId
        } = data;

        const contrato = new ethers.Contract(CONTRATO_REGISTRO_RESIDENTE_ADDRESS, abi, signer); // Crea una nueva instancia del contrato utilizando el firmante (para firmar transacciones).

        const tx = await contrato.registrarResidente( // Llama a la función registrarResidente del contrato inteligente con los datos proporcionados.
            preNombres,
            primerApellido,
            segundoApellido,
            fechaNacimiento,
            fechaInscripcion,
            direccion,
            telefonoCelular,
            fotoHash,
            firmaHash,
            idDigital,
            estadoCivilId,
            sexoId,
            distritoId
        );

        await tx.wait(); // Espera a que la transacción sea confirmada en la blockchain.
        return tx.hash; // Retorna el hash de la transacción para hacer seguimiento.
    } catch (error) { // Si ocurre un error durante el registro, lo captura y lo muestra.
        console.error("Error en registrarResidente:", error);
        throw error; // Lanza el error para ser manejado por quien llame a esta función.
    }
}

async function obtenerTodosResidentes() { // Función asíncrona para obtener todos los residentes registrados.
    try {
        const idsBigInt = await contratoConProvider.obtenerTodosResidenteIds(); // Llama al contrato para obtener los IDs de todos los residentes.
        const ids = idsBigInt.map(id => Number(id)); // Convierte los IDs de BigInt a tipo Number.

        const residentesPromises = ids.map(async (id) => { // Mapea los IDs de los residentes para obtener sus datos.
            const residente = await contratoConProvider.obtenerResidente(id); // Obtiene los datos de cada residente utilizando su ID.
            return { // Retorna un objeto con la información del residente.
                id: Number(residente.id),
                preNombres: residente.preNombres,
                primerApellido: residente.primerApellido,
                segundoApellido: residente.segundoApellido,
                fechaNacimiento: Number(residente.fechaNacimiento),
                fechaInscripcion: Number(residente.fechaInscripcion),
                direccion: residente.direccion,
                telefonoCelular: residente.telefonoCelular,
                fotoHash: residente.fotoHash,
                firmaHash: residente.firmaHash,
                idDigital: residente.idDigital,
                estadoCivilId: Number(residente.estadoCivilId),
                sexoId: Number(residente.sexoId),
                distritoId: Number(residente.distritoId)
            };
        });

        return await Promise.all(residentesPromises); // Espera a que se resuelvan todas las promesas de los residentes y las retorna.
    } catch (error) { // Si ocurre un error durante la obtención de los residentes, lo captura y lo muestra.
        console.error("Error en obtenerTodosResidentes:", error);
        throw error; // Lanza el error para ser manejado por quien llame a esta función.
    }
}

async function obtenerResidenteById(id) { // Función asíncrona para obtener un residente por su ID.
    try {
        const residente = await contratoConProvider.obtenerResidente(id); // Obtiene los datos del residente usando el ID.
        return { // Retorna los datos del residente en un formato adecuado.
            id: Number(residente.id),
            preNombres: residente.preNombres,
            primerApellido: residente.primerApellido,
            segundoApellido: residente.segundoApellido,
            fechaNacimiento: Number(residente.fechaNacimiento),
            fechaInscripcion: Number(residente.fechaInscripcion),
            direccion: residente.direccion,
            telefonoCelular: residente.telefonoCelular,
            fotoHash: residente.fotoHash,
            firmaHash: residente.firmaHash,
            idDigital: residente.idDigital,
            estadoCivilId: Number(residente.estadoCivilId),
            sexoId: Number(residente.sexoId),
            distritoId: Number(residente.distritoId)
        };
    } catch (error) { // Si ocurre un error durante la obtención de los datos del residente, lo captura y lo muestra.
        console.error(`Error en obtenerResidenteById(${id}):`, error);
        throw error; // Lanza el error para ser manejado por quien llame a esta función.
    }
}

async function loginByIdDigital(idDigital) { // Función asíncrona para realizar un login usando el ID digital.
    try {
        const idsBigInt = await contratoConProvider.obtenerTodosResidenteIds(); // Obtiene todos los IDs de los residentes.
        for (const id of idsBigInt) { // Itera sobre cada ID de residente.
            const residente = await contratoConProvider.obtenerResidente(id); // Obtiene los datos de cada residente.
            if (residente.idDigital === idDigital) { // Si el ID digital coincide con el proporcionado, retorna los datos del residente.
                return {
                    id: Number(residente.id),
                    preNombres: residente.preNombres,
                    primerApellido: residente.primerApellido,
                    segundoApellido: residente.segundoApellido,
                    fechaNacimiento: Number(residente.fechaNacimiento),
                    fechaInscripcion: Number(residente.fechaInscripcion),
                    direccion: residente.direccion,
                    telefonoCelular: residente.telefonoCelular,
                    fotoHash: residente.fotoHash,
                    firmaHash: residente.firmaHash,
                    idDigital: residente.idDigital,
                    estadoCivilId: Number(residente.estadoCivilId),
                    sexoId: Number(residente.sexoId),
                    distritoId: Number(residente.distritoId)
                };
            }
        }
        throw new Error("ID Digital no encontrado"); // Si no se encuentra el ID digital, lanza un error.
    } catch (error) { // Si ocurre un error durante el proceso, lo captura y lo muestra.
        console.error("Error en loginByIdDigital:", error);
        throw error; // Lanza el error para ser manejado por quien llame a esta función.
    }
}

module.exports = { // Exporta las funciones para que puedan ser utilizadas en otros archivos.
    registrarResidente,
    obtenerTodosResidentes,
    obtenerResidenteById,
    loginByIdDigital
};
