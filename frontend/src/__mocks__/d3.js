// Mock implementation of d3
const createChainableMock = () => {
  const mock = {
    append: jest.fn(() => createChainableMock()),
    attr: jest.fn(() => mock),
    style: jest.fn(() => mock),
    text: jest.fn(() => mock),
    call: jest.fn(() => mock),
    on: jest.fn(() => mock),
    selectAll: jest.fn(() => createChainableMock()),
    data: jest.fn(() => mock),
    enter: jest.fn(() => mock),
    exit: jest.fn(() => mock),
    remove: jest.fn(() => mock),
    join: jest.fn(() => mock),
    node: jest.fn(() => ({})),
    datum: jest.fn(() => mock),
    transition: jest.fn(() => mock),
    duration: jest.fn(() => mock),
    html: jest.fn(() => mock),
  };
  return mock;
};

const d3 = {
  select: jest.fn(() => createChainableMock()),
  scaleTime: jest.fn().mockReturnValue({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    invert: jest.fn().mockReturnValue(new Date()),
  }),
  scaleLinear: jest.fn().mockReturnValue({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    nice: jest.fn().mockReturnThis(),
  }),
  axisBottom: jest.fn().mockReturnValue({
    ticks: jest.fn().mockReturnThis(),
    tickFormat: jest.fn().mockReturnThis(),
    tickSize: jest.fn().mockReturnThis(),
  }),
  axisLeft: jest.fn().mockReturnValue({
    ticks: jest.fn().mockReturnThis(),
    tickFormat: jest.fn().mockReturnThis(),
    tickSize: jest.fn().mockReturnThis(),
  }),
  line: jest.fn().mockReturnValue({
    x: jest.fn().mockReturnThis(),
    y: jest.fn().mockReturnThis(),
    curve: jest.fn().mockReturnThis(),
  }),
  curveMonotoneX: jest.fn(),
  extent: jest.fn().mockReturnValue([new Date(), new Date()]),
  max: jest.fn().mockReturnValue(100),
  bisector: jest.fn().mockReturnValue({
    left: jest.fn().mockReturnValue(1),
  }),
  pointer: jest.fn().mockReturnValue([50, 50]),
  timeFormat: jest.fn().mockReturnValue(() => '01/01/2023'),
  format: jest.fn().mockReturnValue(() => '100'),
};

// Add all properties to module.exports
module.exports = d3;
module.exports.select = d3.select;
module.exports.scaleTime = d3.scaleTime;
module.exports.scaleLinear = d3.scaleLinear;
module.exports.axisBottom = d3.axisBottom;
module.exports.axisLeft = d3.axisLeft;
module.exports.line = d3.line;
module.exports.extent = d3.extent;
module.exports.max = d3.max;
module.exports.timeFormat = d3.timeFormat;
module.exports.format = d3.format;
