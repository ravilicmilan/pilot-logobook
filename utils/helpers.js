import { z } from 'zod';

export const logbookSchema = z
  .object({
    date: z.string().date(),
    departure_airport: z.string().min(3).max(4),
    departure_time: z.string(),
    destination_airport: z.string().min(3).max(4),
    destination_time: z.string(),
    aircraft_model: z.string(),
    aircraft_registration: z.string(),
    single_engine_time: z.string(),
    multi_engine_time: z.string(),
    multi_pilot_time: z.string(),
    total_flight_time: z.string(),
    pic_name: z.string(),
    landings_day: z.preprocess(
      (val) => (val === '' || val === undefined ? 0 : val),
      z.coerce.number().int().default(0)
    ),
    landings_night: z.preprocess(
      (val) => (val === '' || val === undefined ? 0 : val),
      z.coerce.number().int().default(0)
    ),
    operational_night_time: z.string(),
    operational_ifr_time: z.string(),
    pic_time: z.string(),
    co_pilot_time: z.string(),
    dual_time: z.string(),
    instructor_time: z.string(),
    simulator_date: z.string(),
    simulator_type: z.string(),
    simulator_time: z.string(),
    remarks: z.string(),
    type_of_flight: z.string(),
    page_num: z.coerce.number().int().positive(),
    route: z.string(),
  })
  .partial();
