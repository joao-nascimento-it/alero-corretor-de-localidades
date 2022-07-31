import { CorrectLocalidade } from "../../models/CorrectLocalidade.ts";
import {
  InsertItem,
  QueryAllItems,
} from "../JsonRepository/IJsonRepository.ts";

export type InsertCorrectLocalidade<E> = InsertItem<CorrectLocalidade, E>;
export type QueryAllCorrectLocalidade<E> = QueryAllItems<CorrectLocalidade, E>;
