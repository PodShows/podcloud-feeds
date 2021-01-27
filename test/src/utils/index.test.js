import { expect } from "chai";
import * as utils from "~/utils";

describe("Utils", () => {
  describe("empty", () => {
    const empty = utils.empty;

    it("should return true with empty string", () => {
      expect(empty("")).to.be.true;
    });

    it("should return true with null", () => {
      expect(empty(null)).to.be.true;
    });

    it("should return true with undefined", () => {
      expect(empty(undefined)).to.be.true;
    });

    it("should return true with only spaces", () => {
      expect(empty("   ")).to.be.true;
    });

    it("should return true with object", () => {
      expect(empty({ abc: 123 })).to.be.true;
    });

    it("should return true with array", () => {
      expect(empty(["abc"])).to.be.true;
    });

    it("should return true with number", () => {
      expect(empty(5)).to.be.true;
    });

    it("should return false with non-empty string", () => {
      expect(empty("not empty")).to.be.false;
    });
  });
});
