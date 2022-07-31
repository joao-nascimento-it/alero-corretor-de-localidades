interface IResult<T, E> {
  isDone(): this is Done<T, E>;
  isFail(): this is Fail<T, E>;
}

class Done<T, E> implements IResult<T, E> {
  constructor(readonly value: T) {
  }

  isDone(): this is Done<T, E> {
    return true;
  }

  isFail(): this is Fail<T, E> {
    return false;
  }
}

class Fail<T, E> implements IResult<T, E> {
  constructor(readonly value: E) {
  }

  isDone(): this is Done<T, E> {
    return false;
  }

  isFail(): this is Fail<T, E> {
    return true;
  }
}

export type Result<T, E> = Done<T, E> | Fail<T, E>;
export const Result = {
  done<T, E>(value: T): Result<T, E> {
    return new Done(value);
  },
  fail<T, E>(value: E): Result<T, E> {
    return new Fail(value);
  },
};
