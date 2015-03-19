import { Cursor } from "../../src/cursor";
import { cursorToArray } from "../support/io-helpers";

let subject = new XDR.String(2);

describe('String#read', function() {

  it('decodes correctly', function() {
    expect(read([0x00,0x00,0x00,0x00])).to.eql("");
    expect(read([0x00,0x00,0x00,0x01,0x41,0x00,0x00,0x00])).to.eql("A");
    expect(read([0x00,0x00,0x00,0x02,0x41,0x41,0x00,0x00])).to.eql("AA");
  });

  it("throws a read error when the encoded length is greater than the allowed max", function() {
    expect(() => read([0x00,0x00,0x00,0x03])).to.throw(/read error/i);
  });

  function read(bytes) {
    let io = new Cursor(bytes);
    return subject.read(io);
  }
});

describe('String#write', function() {

  it('encodes correctly', function() {
    expect(write("")).to.eql([0x00,0x00,0x00,0x00]);
    expect(write("A")).to.eql([0x00,0x00,0x00,0x01,0x41,0x00,0x00,0x00]);
    expect(write("AA")).to.eql([0x00,0x00,0x00,0x02,0x41,0x41,0x00,0x00]);
  });

  function write(value) {
    let io = new Cursor(8);
    subject.write(value, io);
    return cursorToArray(io);
  }
});

describe('String#isValid', function() {
  it('returns true for strings of the correct length', function() {
    expect(subject.isValid("")).to.be.true;
    expect(subject.isValid("a")).to.be.true;
    expect(subject.isValid("aa")).to.be.true;
  });

  it('returns false for strings that are too large', function() {
    expect(subject.isValid("aaa")).to.be.false;
  });

  it('returns false for non string', function() {
    expect(subject.isValid(true)).to.be.false;
    expect(subject.isValid(null)).to.be.false;
    expect(subject.isValid(3)).to.be.false;
    expect(subject.isValid([0])).to.be.false;
  });
});

