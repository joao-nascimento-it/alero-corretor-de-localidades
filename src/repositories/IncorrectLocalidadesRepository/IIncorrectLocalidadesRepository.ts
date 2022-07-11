import { QueryFirstItem } from "@/repositories/JsonRepository/IJsonRepository.ts";
import { Localidade } from "@/models/Localidade.ts";

export type QueryFirstIncorrectLocalidade<E> = QueryFirstItem<Localidade, E>;
