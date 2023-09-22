import { HocManager } from './../src';
// import { HocDocument } from './../inft';
import { jest, beforeAll, beforeEach, afterAll, describe, expect, test } from '@jest/globals';

let HOC: HocManager;
let data: {
    last_name: string,
    customer_id: number
};

let newData: string | void;

beforeAll(() => {
    console.log("Start createing contace");
    // HOC = new HocManager();
});


beforeEach(async () => {

    data = {
        last_name: "",
        customer_id: 1233
    };

    newData = await HOC.insertNewData(data);

});

describe('Genarate data and verify the data', () => {

    test('Genarate data', async () => {
        expect(typeof newData).toEqual("string");
        expect(newData).toEqual(data.last_name);
    });

    test('Func: Verify data', () => {
        // expect(typeof key).toEqual("object");
        // expect(typeof cert).toEqual("object");
    });

});

afterAll((done) => {
    jest.clearAllMocks();
    done();
});