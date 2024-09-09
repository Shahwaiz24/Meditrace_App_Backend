import express from "express";
import Database from "../config/database";
import { Db, ObjectId, } from "mongodb";
import { BagModel } from "../model/bag_model";

export class  BagController {
    static async addBag(request: express.Request, response: express.Response) {
        try {
            let db: Db = await Database.getDatabase();

            let body: BagModel = request.body;

            let collection = db.collection('users');
            let checking = {};

            
        } catch (error) {
            
        }
    }
}