import { Localidade } from "../../models/Localidade.ts";
import { InsertItem } from "../JsonRepository/IJsonRepository.ts";

export type InsertIgnoredLocalidade<E> = InsertItem<Localidade, E>;
