import {Request, Response} from "express";

export type RequestWithParams<T> = Request<T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithBody<T> = Request<{},{},T>