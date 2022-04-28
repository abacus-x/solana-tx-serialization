import { expect } from 'chai';
import nacl from 'tweetnacl';
import {
  Transaction,
  VoteProgram,
  SystemProgram,
  PublicKey,
  Keypair,
} from '@solana/web3.js';

describe('Test sort account metas', function () {
  // Arrange
  const signerOne = new PublicKey(
    'S6EA7XsNyxg4yx4DJRMm7fP21jgZb1fuzBAUGhgVtkP'
  );
  const receiverOne = new PublicKey(
    'BKdt9U6V922P17ui81dzLoqgSY2B5ds1UD13rpwFB2zi'
  );
  const signerTwo = new PublicKey(
    'DtDZCnXEN69n5W6rN5SdJFgedrWdK8NV9bsMiJekNRyu'
  );
  const receiverTwo = new PublicKey(
    'FXgds3n6SNCoVVV4oELSumv8nKzAfqSgmeu7cNPikKFT'
  );
  const signerThree = new PublicKey(
    'C2UwQHqJ3BmEJHSMVmrtZDQGS2fGv8fZrWYGi18nHF5k'
  );
  const receiverThree = new PublicKey(
    '8YPqwYXZtWPd31puVLEUPamS4wTv6F89n8nXDA5Ce2Bg'
  );
  const lamports = 2_000_000;

  // Act
  const tx = new Transaction();
  tx.feePayer = signerOne;
  tx.recentBlockhash = 'EETubP5AKHgjPAhzPAFcb8BAY1hMH639CWCFTqi3hq1k';

  tx.add(
    SystemProgram.transfer({
      fromPubkey: signerOne,
      toPubkey: receiverOne,
      lamports: lamports,
    })
  );
  tx.add(
    SystemProgram.transfer({
      fromPubkey: signerTwo,
      toPubkey: receiverTwo,
      lamports: lamports,
    })
  );
  tx.add(
    SystemProgram.transfer({
      fromPubkey: signerThree,
      toPubkey: receiverThree,
      lamports: lamports,
    })
  );

  // Assert
  it('base64 matches', function () {
    const b64check =
      'AwABBwZtbiRMvgQjcE2kVx9yon8XqPSO5hwc2ApflnOZMu0Qo9G5/xbhB0sp8/03Rv9x4MKSkQ+k4LB6lNLvCgKZ/ju/aw+EyQpTObVa3Xm+NA1gSTzutgFCTfkDto/0KtuIHHAMpKRb92NImxKeWQJ2/291j6nTzFj1D6nW25p7TofHmVsGt8uFnTv7+8vsWZ0uN7azdxa+jCIIm4WzKK+4uKfX39t5UA7S1soBQaJkTGOQkSbBo39gIjDkbW0TrevslgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxJrndgN4IFTxep3s6kO0ROug7bEsbx0xxuDkqEvwUusDBgIABAwCAAAAgIQeAAAAAAAGAgIFDAIAAACAhB4AAAAAAAYCAQMMAgAAAICEHgAAAAAA';
    expect(tx.compileMessage().serialize().toString('base64')).to.equal(
      b64check
    );
  });
});

describe('Test vote program', function () {
  // Arrange
  const withdrawerKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
      134, 123, 27, 208, 227, 175, 253, 99, 4, 81, 170, 231, 186, 141, 177, 142,
      197, 139, 94, 6, 157, 2, 163, 89, 150, 121, 235, 86, 185, 22, 1, 233, 58,
      133, 229, 39, 212, 71, 254, 72, 246, 45, 160, 156, 129, 199, 18, 189, 53,
      143, 98, 72, 182, 106, 69, 29, 38, 145, 119, 190, 13, 105, 157, 112,
    ])
  );

  const voteAccountPubkey = new PublicKey(
    'CWqJy1JpmBcx7awpeANfrPk6AsQKkmego8ujjaYPGFEk'
  );
  const receiverAccountPubkey = new PublicKey(
    'A1V5gsis39WY42djdTKUFsgE5oamk4nrtg16WnKTuzZK'
  );

  // Act
  const tx = new Transaction();
  tx.feePayer = withdrawerKeypair.publicKey;
  tx.recentBlockhash = 'Add1tV7kJgNHhTtx3Dgs6dhC7kyXrGJQZ2tJGW15tLDH';
  tx.add(
    VoteProgram.withdraw({
      votePubkey: voteAccountPubkey,
      authorizedWithdrawerPubkey: withdrawerKeypair.publicKey,
      lamports: 2_000_000_000,
      toPubkey: receiverAccountPubkey,
    })
  );

  // Assert
  it('base64 matches', function () {
    const b64check =
      'AQABBDqF5SfUR/5I9i2gnIHHEr01j2JItmpFHSaRd74NaZ1whdju9KDr87dR4CFbvp8kmkq1rSYitXg2nDzw1kcQsBarFQYO0flqHdOoQpaNxOZ8eSlkLWHns0kvxLHtDo6WbQdhSB01dHS7fE12JOvTvbPYNV5z0RBD/A2jU4AAAAAAjxrQaMS7FjmaR++mvFr3XE6XbzMUTMJUIpITrUWBzGwBAwMCAQAMAwAAAACUNXcAAAAA';
    expect(tx.compileMessage().serialize().toString('base64')).to.equal(
      b64check
    );
  });
});

describe('Test create nonce account', function () {
  // Arrange
  const fromKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
      134, 123, 27, 208, 227, 175, 253, 99, 4, 81, 170, 231, 186, 141, 177, 142,
      197, 139, 94, 6, 157, 2, 163, 89, 150, 121, 235, 86, 185, 22, 1, 233, 58,
      133, 229, 39, 212, 71, 254, 72, 246, 45, 160, 156, 129, 199, 18, 189, 53,
      143, 98, 72, 182, 106, 69, 29, 38, 145, 119, 190, 13, 105, 157, 112,
    ])
  );
  const nonceKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
      139, 81, 72, 75, 252, 57, 73, 247, 63, 130, 201, 76, 183, 43, 60, 197, 65,
      154, 28, 240, 134, 0, 232, 108, 61, 123, 56, 26, 35, 201, 13, 39, 188,
      128, 179, 175, 136, 5, 89, 185, 92, 183, 175, 131, 56, 53, 228, 11, 20,
      34, 138, 148, 51, 27, 205, 76, 75, 148, 184, 34, 74, 129, 238, 225,
    ])
  );

  // Act
  const tx = new Transaction();
  tx.recentBlockhash = '6tHKVLgLBEm25jaDsmatPTfoeHqSobTecJMESteTkPS6';
  tx.feePayer = fromKeypair.publicKey;
  tx.add(
    SystemProgram.createNonceAccount({
      fromPubkey: fromKeypair.publicKey,
      noncePubkey: nonceKeypair.publicKey,
      authorizedPubkey: fromKeypair.publicKey,
      lamports: 2_000_000,
    })
  );
  const serializedMsg = tx.serializeMessage();
  tx.addSignature(
    fromKeypair.publicKey,
    nacl.sign.detached(serializedMsg, fromKeypair.secretKey)
  );
  tx.addSignature(
    nonceKeypair.publicKey,
    nacl.sign.detached(serializedMsg, nonceKeypair.secretKey)
  );

  // Assert
  it('base64 matches', function () {
    const b64check =
      'AkBAiPTJfOYZRLOZUpH7vIxyJQovMxO7X8FxXyRzae8CECBZ9LS5G8hxZVMdVL6uSIzLHb/0aLYhO5FEVmfhwguY5ZtOCOGqjwyAOVr8L2eBXgX482L/rcmF6ELORIcD1GdAFBQ/1Hc/LByer9TbJfNqzjesdzTJEHohnStduU4OAgADBTqF5SfUR/5I9i2gnIHHEr01j2JItmpFHSaRd74NaZ1wvICzr4gFWblct6+DODXkCxQiipQzG81MS5S4IkqB7uEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAan1RcZLFaO4IqEX3PSl4jPA1wxRbIas0TYBi6pQAAABqfVFxksXFEhjMlMPUrxf1ja7gibof1E49vZigAAAABXbYHxIfw3Z5Qq1LH8aj6Sj6LuqbCuwFhAmo21XevlfwICAgABNAAAAACAhB4AAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAwEDBCQGAAAAOoXlJ9RH/kj2LaCcgccSvTWPYki2akUdJpF3vg1pnXA=';
    expect(tx.serialize().toString('base64')).to.equal(b64check);
  });
});

describe('Test advance nonce and transfer', function () {
  // Arrange
  const fromKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
      134, 123, 27, 208, 227, 175, 253, 99, 4, 81, 170, 231, 186, 141, 177, 142,
      197, 139, 94, 6, 157, 2, 163, 89, 150, 121, 235, 86, 185, 22, 1, 233, 58,
      133, 229, 39, 212, 71, 254, 72, 246, 45, 160, 156, 129, 199, 18, 189, 53,
      143, 98, 72, 182, 106, 69, 29, 38, 145, 119, 190, 13, 105, 157, 112,
    ])
  );
  const nonceKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
      139, 81, 72, 75, 252, 57, 73, 247, 63, 130, 201, 76, 183, 43, 60, 197, 65,
      154, 28, 240, 134, 0, 232, 108, 61, 123, 56, 26, 35, 201, 13, 39, 188,
      128, 179, 175, 136, 5, 89, 185, 92, 183, 175, 131, 56, 53, 228, 11, 20,
      34, 138, 148, 51, 27, 205, 76, 75, 148, 184, 34, 74, 129, 238, 225,
    ])
  );
  const toKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
      56, 246, 74, 56, 168, 158, 189, 97, 126, 149, 175, 70, 23, 14, 251, 206,
      172, 69, 61, 247, 39, 226, 8, 68, 97, 159, 11, 196, 212, 57, 2, 1, 252,
      124, 54, 3, 18, 109, 223, 27, 225, 28, 59, 202, 49, 248, 244, 17, 165, 33,
      101, 59, 217, 79, 234, 217, 251, 85, 9, 6, 40, 0, 221, 10,
    ])
  );

  // Act
  const tx = new Transaction();
  tx.recentBlockhash = '6DPp9aRRX6cLBqj5FepEvoccHFs3s8gUhd9t9ftTwAta';
  tx.feePayer = fromKeypair.publicKey;
  tx.add(
    SystemProgram.nonceAdvance({
      noncePubkey: nonceKeypair.publicKey,
      authorizedPubkey: fromKeypair.publicKey,
    })
  );
  tx.add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: 2_000_000,
    })
  );
  const serializedMsg = tx.serializeMessage();
  tx.addSignature(
    fromKeypair.publicKey,
    nacl.sign.detached(serializedMsg, fromKeypair.secretKey)
  );

  // Assert
  it('base64 matches', function () {
    const b64check =
      'Af67rLfP5WxsOgvZWndq34S2KbQq++x03eZkZagzbVQ2tRyfFyn6OWByp8q3P2a03HDeVtpUWhq1y1a6R0DcPAIBAAIFOoXlJ9RH/kj2LaCcgccSvTWPYki2akUdJpF3vg1pnXC8gLOviAVZuVy3r4M4NeQLFCKKlDMbzUxLlLgiSoHu4fx8NgMSbd8b4Rw7yjH49BGlIWU72U/q2ftVCQYoAN0KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGp9UXGSxWjuCKhF9z0peIzwNcMUWyGrNE2AYuqUAAAE13Mu8zaQSpG0zzGHpG62nK56DbGhuS4kXMF/ChHY1jAgMDAQQABAQAAAADAgACDAIAAACAhB4AAAAAAA==';
    expect(tx.serialize().toString('base64')).to.equal(b64check);
  });
});
