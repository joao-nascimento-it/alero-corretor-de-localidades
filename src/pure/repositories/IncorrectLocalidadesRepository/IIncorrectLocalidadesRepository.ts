import {
  DeleteFirstItem,
  QueryFirstItem,
} from "../JsonRepository/IJsonRepository.ts";
import { Localidade } from "../../models/Localidade.ts";

export type QueryFirstIncorrectLocalidade<E> = QueryFirstItem<Localidade, E>;
export type DeleteFirstIncorrectLocalidade<E> = DeleteFirstItem<Localidade, E>;
