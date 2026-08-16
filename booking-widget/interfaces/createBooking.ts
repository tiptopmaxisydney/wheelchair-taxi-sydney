export interface IVehicleTypeOptions {
    _id: string;
    vehicle_type: string;
    image: string;
}

export interface IVehicleDetails {
    vehicle_id: {
        _id: string;
        image: string;
        __v: number;
    };
    vehicle_name: string;
    luggage: number;
    passenger: number;
    handbags: number;
    wheel_chair_charges: number;
    is_wheelchair_vehicle?: boolean;
    child_seat_charges: number;
    base_fee: any;
    surcharge_amount: any;
    tax: number;
    child_seat?:number;
    wheel_chair?: number;
    child_capsule?:number;
    child_capsule_charges?:number,
    max_babyseat?: number;
    max_babycapsule?: number;
    max_wheelchair?: number;
    airport_toll:any,
    gov_levy:any;
    distance:any;
    distance_fare?: any;
    toll_charges: any;
    surcharge_type: string;
    tax_percentage: string;
    one_way_amount?: number;
    return_trip_amount?: number;
}