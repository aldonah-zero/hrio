from datetime import datetime, date, time
from typing import Any, List, Optional, Union, Set
from enum import Enum
from pydantic import BaseModel, field_validator


############################################
# Enumerations are defined here
############################################

############################################
# Classes are defined here
############################################
class CenaCreate(BaseModel):
    cena: float
    id: int
    status: str
    nacin_placanja: str
    datum_uplate: date
    sesija_2: int  # N:1 Relationship (mandatory)
    klijent_1: int  # N:1 Relationship (mandatory)


class SesijaGrupaCreate(BaseModel):
    id: int
    grupa: int  # N:1 Relationship (mandatory)
    sesija_1: int  # N:1 Relationship (mandatory)


class SesijaKlijentCreate(BaseModel):
    id: int
    klijent: int  # N:1 Relationship (mandatory)
    sesija: int  # N:1 Relationship (mandatory)


class SesijaCreate(BaseModel):
    cena: float                                      # float column - price of session
    status: str
    id: int
    pocetak: datetime
    klijent_id: Optional[int] = None
    kraj: datetime
    uplate: Optional[List[int]] = None               # FIXED: was 'cena' (conflict!), now 'uplate' - 1:N Relationship to Cena
    sesijaklijent_1: Optional[List[int]] = None      # 1:N Relationship
    sesijagrupa_1: Optional[List[int]] = None        # 1:N Relationship


class GrupaCreate(BaseModel):
    opis: str
    id: int
    cena: float
    naziv: str
    sesijagrupa: Optional[List[int]] = None  # 1:N Relationship


class KlijentCreate(BaseModel):
    ime: str
    email: str
    id: int
    prezime: str
    broj_telefona: str
    sesijaklijent: Optional[List[int]] = None  # 1:N Relationship
    cena_1: Optional[List[int]] = None  # 1:N Relationship