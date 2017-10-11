import { expect } from "chai";
import * as utils from "~/utils";

describe("Utils", () => {
	describe("notEmpty", () => {
		const notEmpty = utils.notEmpty;

		it("should return false with empty string", () => {
			expect(notEmpty("")).to.be.false;
		});

		it("should return false with null", () => {
			expect(notEmpty(null)).to.be.false;
		});

		it("should return false with undefined", () => {
			expect(notEmpty(undefined)).to.be.false;
		});

		it("should return false with only spaces", () => {
			expect(notEmpty("   ")).to.be.false;
		});

		it("should return false with object", () => {
			expect(notEmpty({"abc": 123})).to.be.false;
		});

		it("should return false with array", () => {
			expect(notEmpty(["abc"])).to.be.false;
		});

		it("should return false with number", () => {
			expect(notEmpty(5)).to.be.false;
		});

		it("should return true with non-empty string", () => {
			expect(notEmpty("not empty")).to.be.true;
		});
	});
});