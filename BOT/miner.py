import hashlib
import time

class Block:
    def __init__(self, index, previous_hash, timestamp, data, nonce=0):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.nonce = nonce

    def calculate_hash(self):
        return hashlib.sha256(
            (str(self.index) + self.previous_hash + str(self.timestamp) + self.data + str(self.nonce)).encode()
        ).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = []
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = Block(0, "0", time.time(), "Genesis Block")
        self.chain.append(genesis_block)

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, new_block):
        new_block.previous_hash = self.get_latest_block().calculate_hash()
        new_block.nonce = self.proof_of_work(new_block)
        self.chain.append(new_block)

    def proof_of_work(self, block, difficulty=4):
        nonce = 0
        while True:
            block.nonce = nonce
            hash_value = block.calculate_hash()
            if hash_value[:difficulty] == '0' * difficulty:
                return nonce
            nonce += 1

if __name__ == "__main__":
    blockchain = Blockchain()
    try:
        while True:
            new_block = Block(len(blockchain.chain), "", time.time(), "New Block")
            blockchain.add_block(new_block)
            print(f"Block #{new_block.index} mined.")
            #time.sleep(1)  # Adjust the sleep time as needed
    except KeyboardInterrupt:
        print("Mining stopped by user.")
