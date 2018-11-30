import {AddressMapping, IAddressMapping} from '../src/AddressMapping'
import {relativeCellAddress, simpleCellAddress} from '../src/Cell'
import {RangeVertex, ValueCellVertex, EmptyCellVertex} from '../src/Vertex'

const sharedExamples = (builder: () => IAddressMapping) => {
  it('simple set', () => {
    const mapping = builder()
    const vertex = new ValueCellVertex(42)
    const address = relativeCellAddress(0, 0)

    mapping.setCell(address, vertex)

    expect(mapping.getCell(address)).toBe(vertex)
  })

  it('set and using different reference when get', () => {
    const mapping = builder()
    const vertex = new ValueCellVertex(42)

    mapping.setCell(relativeCellAddress(0, 0), vertex)

    expect(mapping.getCell(relativeCellAddress(0, 0))).toBe(vertex)
  })

  it("get when there's even no column", () => {
    const mapping = builder()

    expect(mapping.getCell(relativeCellAddress(0, 0))).toBe(EmptyCellVertex.getSingletonInstance())
  })

  it('get when there was already something in that column', () => {
    const mapping = builder()

    mapping.setCell(relativeCellAddress(0, 1), new ValueCellVertex(42))

    expect(mapping.getCell(relativeCellAddress(0, 0))).toBe(EmptyCellVertex.getSingletonInstance())
  })

  it("set when there's already something in that column", () => {
    const mapping = builder()
    const vertex0 = new ValueCellVertex(42)
    const vertex1 = new ValueCellVertex(42)
    mapping.setCell(relativeCellAddress(0, 0), vertex0)

    mapping.setCell(relativeCellAddress(0, 1), vertex1)

    expect(mapping.getCell(relativeCellAddress(0, 0))).toBe(vertex0)
    expect(mapping.getCell(relativeCellAddress(0, 1))).toBe(vertex1)
  })

  it('set overrides old value', () => {
    const mapping = builder()
    const vertex0 = new ValueCellVertex(42)
    const vertex1 = new ValueCellVertex(42)
    mapping.setCell(relativeCellAddress(0, 0), vertex0)

    mapping.setCell(relativeCellAddress(0, 0), vertex1)

    expect(mapping.getCell(relativeCellAddress(0, 0))).toBe(vertex1)
  })

  it("has when there's even no column", () => {
    const mapping = builder()

    expect(mapping.has(relativeCellAddress(0, 0))).toBe(false)
  })

  it('has when there was already something in that column', () => {
    const mapping = builder()

    mapping.setCell(relativeCellAddress(0, 1), new ValueCellVertex(42))

    expect(mapping.has(relativeCellAddress(0, 0))).toBe(false)
  })

  it('has when there is a value', () => {
    const mapping = builder()

    mapping.setCell(relativeCellAddress(0, 0), new ValueCellVertex(42))

    expect(mapping.has(relativeCellAddress(0, 0))).toBe(true)
  })

  it('range mapping when there is none', () => {
    const mapping = builder()
    const start = simpleCellAddress(0, 0)
    const end = simpleCellAddress(20, 50)
    const vertex = new RangeVertex(start, end)

    expect(mapping.getRange(start, end)).toBe(null)
  })

  it('setting range mapping', () => {
    const mapping = builder()
    const start = simpleCellAddress(0, 0)
    const end = simpleCellAddress(20, 50)
    const vertex = new RangeVertex(start, end)

    mapping.setRange(vertex)

    expect(mapping.getRange(start, end)).toBe(vertex)
  })

  it('returns maximum row/col for simplest case', () => {
    const mapping = new AddressMapping(1, 2)

    expect(mapping.getMaximumRow()).toEqual(2)
    expect(mapping.getMaximumCol()).toEqual(1)
  })
}

describe("AddressMapping", () => {
  sharedExamples(() => new AddressMapping())
})
