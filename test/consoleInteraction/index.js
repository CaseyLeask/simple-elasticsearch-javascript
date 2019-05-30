const { expect } = require('chai');
const sinon = require('sinon');

const prompts = require('prompts');

const consoleInteraction = require('../../consoleInteraction');

describe('consoleInteraction', () => {
  describe("when you 'quit' immediately", () => {
    xit('should quit', () => {
      sinon.stub(process, 'exit');

      prompts.inject(['quit']);

      consoleInteraction.begin();

      expect(process.exit.called).to.be.true
    });
  });
});