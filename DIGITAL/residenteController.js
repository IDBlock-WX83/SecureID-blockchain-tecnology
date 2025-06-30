const { ethers } = require('ethers');
const { provider } = require('../config/blockchain');

const CONTRATO_REGISTRO_RESIDENTE_ADDRESS = '0x8720261B55780B36226bf567bb722368188e82dC';

const abi = [
    "function registrarResidente(string,string,string,uint,uint,string,string,string,string,string,uint,uint,uint) public",
    "function obtenerTodosResidenteIds() public view returns (uint[])",
    "function obtenerResidente(uint) public view returns (tuple(uint id,string preNombres,string primerApellido,string segundoApellido,uint fechaNacimiento,uint fechaInscripcion,string direccion,string telefonoCelular,string fotoHash,string firmaHash,string idDigital,uint estadoCivilId,uint sexoId,uint distritoId))"
];

const contratoConProvider = new ethers.Contract(CONTRATO_REGISTRO_RESIDENTE_ADDRESS, abi, provider);

const PRIVATE_KEY_ADMIN = '6ea6ccc2088a17724cfe75f275e2dc618ba33659ed1cbba49dfc67bb3dcf1f42';
const signer = new ethers.Wallet(PRIVATE_KEY_ADMIN, provider);

async function registrarResidente(data) {
    try {
        const {
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

        const contrato = new ethers.Contract(CONTRATO_REGISTRO_RESIDENTE_ADDRESS, abi, signer);

        const tx = await contrato.registrarResidente(
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

        await tx.wait();
        return tx.hash;

    } catch (error) {
        console.error("Error en registrarResidente:", error);
        throw error;
    }
}

async function obtenerTodosResidentes() {
    try {
        const idsBigInt = await contratoConProvider.obtenerTodosResidenteIds();
        const ids = idsBigInt.map(id => Number(id));

        const residentesPromises = ids.map(async (id) => {
            const residente = await contratoConProvider.obtenerResidente(id);

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
        });

        return await Promise.all(residentesPromises);

    } catch (error) {
        console.error("Error en obtenerTodosResidentes:", error);
        throw error;
    }
}

async function obtenerResidenteById(id) {
    try {
        const residente = await contratoConProvider.obtenerResidente(id);

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
    } catch (error) {
        console.error(`Error en obtenerResidenteById(${id}):`, error);
        throw error;
    }
}

async function loginByIdDigital(idDigital) {
    try {
        const idsBigInt = await contratoConProvider.obtenerTodosResidenteIds();
        for (const id of idsBigInt) {
            const residente = await contratoConProvider.obtenerResidente(id);
            if (residente.idDigital === idDigital) {
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
        throw new Error("ID Digital no encontrado");
    } catch (error) {
        console.error("Error en loginByIdDigital:", error);
        throw error;
    }
}

module.exports = {
    registrarResidente,
    obtenerTodosResidentes,
    obtenerResidenteById,
    loginByIdDigital
};
