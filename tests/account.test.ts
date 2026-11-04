import assert from "node:assert/strict";
import { test } from "node:test";
import { addressLine, EMIRATES, formatPhone, normalizePhone, validateAddress, validateProfile } from "../src/lib/account/validation";

test("phone numbers are normalised from every common way of typing a UAE number", () => {
  for (const typed of ["+971 50 212 8613", "050 212 8613", "0502128613", "502128613", "971502128613", "00971502128613", "(050) 212-8613", "+971-50-212-8613"]) {
    assert.equal(normalizePhone(typed), "+971502128613", typed);
  }
  assert.equal(normalizePhone("04 123 4567"), "+97141234567", "landline");
  assert.equal(normalizePhone("+44 20 7946 0958"), "+442079460958", "other countries keep their code");
});

test("phone numbers that are not phone numbers are rejected", () => {
  for (const bad of ["", "abc", "12345", "050 212", "+0123456789", "0502128613 ext 4", "050212861300000", "+971", "5021286", "<script>", null, 42]) {
    assert.equal(normalizePhone(bad), "", String(bad));
  }
});

test("phone numbers display in a readable UAE format", () => {
  assert.equal(formatPhone("+971502128613"), "+971 50 212 8613");
  assert.equal(formatPhone("+442079460958"), "+442079460958");
  assert.equal(formatPhone(null), "");
});

test("profile needs a real name and allows an empty phone", () => {
  assert.equal(validateProfile({ name: "  Amira   Khan ", phone: "" }).valid, true);
  assert.equal(validateProfile({ name: "Amira Khan", phone: "050 212 8613" }).phone, "+971502128613");
  assert.equal(validateProfile({ name: "Amira Khan", phone: "" }).phone, "");
  assert.ok(validateProfile({ name: "A", phone: "" }).errors.name);
  assert.ok(validateProfile({ name: "x".repeat(161), phone: "" }).errors.name);
  assert.ok(validateProfile({ name: "Amira\u0000", phone: "" }).errors.name);
  assert.ok(validateProfile({ name: "Amira Khan", phone: "hello" }).errors.phone);
});

const good = { label: "Home", recipient: "Amira Khan", phone: "0502128613", line1: "Villa 12, Street 4", line2: "", city: "Jumeirah", region: "Dubai", isDefault: true };

test("a complete UAE address is accepted and tidied", () => {
  const result = validateAddress({ ...good, recipient: "  Amira   Khan " });
  assert.equal(result.valid, true);
  assert.equal(result.value.recipient, "Amira Khan");
  assert.equal(result.value.phone, "+971502128613");
  assert.equal(result.value.isDefault, true);
  assert.equal(addressLine(result.value), "Villa 12, Street 4, Jumeirah, Dubai");
});

test("every emirate is accepted and anything else is not", () => {
  for (const region of EMIRATES) assert.equal(validateAddress({ ...good, region }).valid, true, region);
  assert.ok(validateAddress({ ...good, region: "London" }).errors.region);
  assert.ok(validateAddress({ ...good, region: "" }).errors.region);
});

test("missing or unsafe address fields are reported against the right field", () => {
  assert.ok(validateAddress({ ...good, recipient: "" }).errors.recipient);
  assert.ok(validateAddress({ ...good, phone: "nope" }).errors.phone);
  assert.ok(validateAddress({ ...good, line1: "ab" }).errors.line1);
  assert.ok(validateAddress({ ...good, city: "" }).errors.city);
  assert.ok(validateAddress({ ...good, line1: "Villa\r\n12" }).valid === true, "line breaks collapse to spaces");
  assert.ok(validateAddress({ ...good, line1: "Villa\u0000 12" }).errors.line1);
  assert.equal(validateAddress({ ...good, isDefault: "yes" }).value.isDefault, false, "only a real boolean makes it the default");
  assert.equal(validateAddress({ ...good, line2: undefined }).valid, true, "line2 is optional");
});
