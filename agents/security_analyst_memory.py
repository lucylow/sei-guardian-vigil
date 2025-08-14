from redis_client import RedisClient
from weaviate_client import WeaviateCollection
from sqlite_db import SQLiteDB
from utils import embed

class SecurityAnalystMemory:
    def __init__(self):
        self.working_mem = RedisClient(namespace="sec_working")
        self.episodic_mem = WeaviateCollection(name="analyst_episodes")
        self.procedural_mem = SQLiteDB("analyst_procedures.db")
        
    def cache_contract_context(self, contract_address):
        # Store current analysis state
        self.working_mem.set(f"contract:{contract_address}", {
            "vulnerabilities": [],
            "current_line": 0,
            "scan_progress": 0.0
        })
    
    def remember_similar_vuln(self, vulnerability_type):
        # Retrieve similar historical cases
        return self.episodic_mem.query(
            vector=embed(vulnerability_type),
            filters={"category": "vulnerability"}
        )
