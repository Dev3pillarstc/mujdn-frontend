import { City } from "@/models/features/lookups/city";
import { ModelInterceptorContract } from "cast-response";

export class CityInterceptor implements ModelInterceptorContract<City> {
  send(model: City): City {
    // Here you can modify the model before sending it to the server
    return model;
  }

  receive(model: City): City {
    // Here you can modify the model after receiving it from the server
    return model;
  }
}