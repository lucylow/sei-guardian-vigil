from sqlite_db import SQLiteDB
from mem0 import Mem0
from datetime import datetime

class ThreatIntelMemory:
    def __init__(self):
        self.procedural_mem = SQLiteDB("threat_intel.db")
        
    def update_threat_db(self, new_exploit):
        # Store in procedural memory
        self.procedural_mem.execute(
            "INSERT INTO known_exploits VALUES (?, ?, ?)",
            (new_exploit["id"], new_exploit["pattern"], datetime.now())
        )
        
        # Share via Mem0
        Mem0.publish("threat_intel", {
            "type": "exploit_update",
            "data": new_exploit
        })
