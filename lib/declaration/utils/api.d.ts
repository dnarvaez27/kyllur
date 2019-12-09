interface SatelliteResponseData {
    satid: number;
    satname: string;
    intDesignator: string;
    launchDate: string;
    satlat: number;
    satlng: number;
    satalt: number;
}
interface CanvasData {
    canvasPosition: {
        x: number;
        y: number;
    };
}
interface Satellite extends SatelliteResponseData, CanvasData {
}
interface StarData {
    nombre: string;
    estado: string;
    masa: number;
    descubrimiento: number;
    actualizacion: string;
    estado_publicacion: string;
    tipo_deteccion: string;
    ra: number;
    dec: number;
    distancia_estrella: number;
    masa_estrella: number;
}
interface Star extends StarData, CanvasData {
}
export declare function getSatellites(latitude: number, longitude: number): Promise<Satellite[]>;
export declare function getStars(latitude: number, longitude: number): Promise<Star[]>;
export {};
