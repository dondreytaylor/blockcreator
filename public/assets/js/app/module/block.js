function Block() {
};

Block.prototype =new  BlockBase;

BlockBase.prototype.template.header = [
  new HeaderVersion(),
  new HeaderPrevBlock(),
  new HeaderMerkleRoot(),
  new HeaderReserved(),
  new HeaderTime(),
  new HeaderBits(),
  new HeaderNounce(),
  new HeaderSolutionSize(),
  new HeaderSolution()
];

BlockBase.prototype.template.transactionCount = new TransactionCount();

BlockBase.prototype.template.transaction = [
  new TransactionVersion(),
  new TransactionFlag(),
  new TransactionInputCount(),
  new TransactionInputs(),
  new TransactionOutputCount(),
  new TransactionOutputs(),
  new TransactionWitness(),
  new TransactionLocktime(),
];
