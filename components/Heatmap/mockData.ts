type Entry = {
    trashbinIdentifier: string;
    time: number; // Unix timestamp
    fillLevel: number; // (0-100)
};
  
function generateMockData(numEntries: number): Entry[] {
const mockData: Entry[] = [];

for (let i = 0; i < numEntries; i++) {
    const trashbinIdentifier = `BIN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const time = Date.now() - Math.floor(Math.random() * 1000000000); // random time in the past
    const fillLevel = Math.floor(Math.random() * 101); // random fill level between 0-100

    mockData.push({ trashbinIdentifier, time, fillLevel });
}

return mockData;
}

// Example usage
const data = generateMockData(10);
console.log(data);
