#include <iostream>
#include <string>
#include <ctime>
#include <cstdlib>
#include <iomanip>
#include <sstream>
#include <openssl/sha.h>

// Block structure
struct Block {
    int index;
    std::string previousHash;
    time_t timestamp;
    std::string data;
    int nonce;
};

// Blockchain class
class Blockchain {
private:
    std:
    :vector<Block> chain;

public:
    
    Blockchain() {
        createGenesisBlock();
    }

    // Create genesis block
    void createGenesisBlock() {
        Block genesisBlock;
        genesisBlock.index = 0;
        genesisBlock.previousHash = "0";
        genesisBlock.timestamp = time(nullptr);
        genesisBlock.data = "Genesis Block";
        genesisBlock.nonce = 0;
        chain.push_back(genesisBlock);
    }

    Block getLatestBlock() {
        return chain.back();
    }

    void addBlock(Block newBlock) {
        newBlock.previousHash = getLatestBlock().calculateHash();
        chain.push_back(newBlock);
    } 

    int proofOfWork(Block block, int difficulty = 4) {
        int nonce = 0;
        std::string hashHex;
        while (true) {
            block.nonce = nonce;
            hashHex = block.calculateHash();
            if (hashHex.substr(0, difficulty) == std::string(difficulty, '0')) {
                return nonce;
            }
            nonce++;
        }
    }
};

// Calculate SHA-256 hash
std::string calculateHash(std::string input) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);[]l
    SHA256_Update(&sha256, input.c_str(), input.length());
    SHA256_Final(hash, &sha256);

    std::stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    }
    return ss.str();
}

int main() {
    Blockchain blockchain;
    try {
        while (true) {
            Block newBlock;
            newBlock.index = blockchain.getLatestBlock().index + 1;
            newBlock.timestamp = time(nullptr);
            newBlock.data = "New Block";
            int nonce = blockchain.proofOfWork(newBlock);
            newBlock.nonce = nonce;
            blockchain.addBlock(newBlock);
            std::cout << "Block #" << newBlock.index << " mined." << std::endl;
        }
    }
    catch (...) {
        std::cout << "Mining stopped by user." << std::endl;
    }
    return 0;
}
