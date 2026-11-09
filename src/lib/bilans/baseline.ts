// AUTOMATSKI GENERISANO iz verifikovanih bruto bilansa (31.10.2026.) i kartice kupaca IDSS (02.11.2026.).
// Sadrži samo zbirne iznose i šifre konta; imena roditelja, djece i fizičkih lica nisu uključena.
// Ponovno generisanje: node tests/gen_baseline.mjs <folder s PDF-ovima>
import type { LedgerSummary, ReconLine } from './parser';

export const BASELINE: { generatedFrom: string[]; documents: LedgerSummary[]; recon: ReconLine[] } = {
  "generatedFrom": [
    "IMH-BRUTO-BILANS-31102026.pdf",
    "IDSS-BRUTO-BILANS-31102026.pdf",
    "IDSS-Dugovna-Strana-Kupci-02112026.pdf"
  ],
  "documents": [
    {
      "id": "IMH|bruto-bilans|31.10.2026|IMH-BRUTO-BILANS-31102026.pdf",
      "entity": "IMH",
      "entityName": "“International Montessori House”Sarajevo",
      "jib": "4201731140006",
      "periodFrom": "1.01.2026",
      "periodTo": "31.10.2026",
      "printedAt": "9.11.2026",
      "fileName": "IMH-BRUTO-BILANS-31102026.pdf",
      "kind": "bruto-bilans",
      "accountsCount": 473,
      "totals": {
        "d": 6610110.49,
        "p": 6610110.49,
        "saldoD": 2161914,
        "saldoP": 2161914
      },
      "issues": [
        {
          "severity": "upozorenje",
          "text": "Prelazni konto 2009 (Transakcijski računi - prelazni konto) nije zatvoren: saldo 56.357,06 KM.",
          "amount": 56357.06
        },
        {
          "severity": "upozorenje",
          "text": "Prelazni konto 207701 (Prelazni račun - Biznis kartica) nije zatvoren: saldo 2.490,41 KM.",
          "amount": 2490.41
        }
      ],
      "metrics": {
        "entity": "IMH",
        "periodTo": "31.10.2026",
        "months": 10,
        "cash": 70241.89,
        "cashInTransit": 58847.47,
        "receivablesCustomers": 58444.39,
        "customersDebit": 82534.93,
        "customersCredit": 24090.54,
        "receivablesEmployees": 127725.36,
        "loansToIndividuals": 39565,
        "loansToRelated": 2600,
        "equity": -18936.3,
        "bankLoans": 94138.42,
        "overdraft": 85290.47,
        "otherLoans": 10945,
        "leasing": 214882.9,
        "externalDebt": 190373.89,
        "deposits": 50417.3,
        "netSalariesPayable": 30042.56,
        "publicAgreements": 3716.03,
        "publicCurrent": 79714.14,
        "revenue": 796601.05,
        "revenueRelated": 0,
        "expenses": 718886.07,
        "result": 77714.98,
        "labor": 491698.23,
        "contractsWork": 5336.74,
        "rent": 60250.32,
        "interest": 11628.85,
        "latePaymentInterest": 1998.4,
        "amortization": 0,
        "ministrySubsidies": 192814
      },
      "customers": {
        "count": 176,
        "debtors": 120,
        "creditors": 39,
        "debitTotal": 82534.93,
        "creditTotal": 19894.19,
        "net": 62640.74,
        "noPayment": [
          {
            "code": "2112-91",
            "saldo": 3400
          },
          {
            "code": "2112-20",
            "saldo": 2606.34
          },
          {
            "code": "2112-77",
            "saldo": 2080
          },
          {
            "code": "2112-271",
            "saldo": 1620
          },
          {
            "code": "2112-121",
            "saldo": 910
          },
          {
            "code": "2112-6",
            "saldo": 880
          },
          {
            "code": "2112-28",
            "saldo": 870
          },
          {
            "code": "2112-83",
            "saldo": 850
          },
          {
            "code": "2112-278",
            "saldo": 750
          },
          {
            "code": "2112-15",
            "saldo": 650
          },
          {
            "code": "2112-87",
            "saldo": 640
          },
          {
            "code": "2112-32",
            "saldo": 620
          },
          {
            "code": "2112-44",
            "saldo": 590
          },
          {
            "code": "2112-30",
            "saldo": 479.68
          },
          {
            "code": "2112-104",
            "saldo": 440
          },
          {
            "code": "2112-53",
            "saldo": 430
          },
          {
            "code": "2112-111",
            "saldo": 410
          },
          {
            "code": "2112-277",
            "saldo": 235
          },
          {
            "code": "2112-50",
            "saldo": 230
          },
          {
            "code": "2112-29",
            "saldo": 200
          },
          {
            "code": "2112-99",
            "saldo": 200
          },
          {
            "code": "2112-51",
            "saldo": 130
          },
          {
            "code": "2112-5",
            "saldo": 110
          },
          {
            "code": "2112-48",
            "saldo": 85
          },
          {
            "code": "2112-42",
            "saldo": 70
          },
          {
            "code": "2112-31",
            "saldo": 60
          },
          {
            "code": "2112-36",
            "saldo": 60
          },
          {
            "code": "2112-86",
            "saldo": 60
          },
          {
            "code": "2112-82",
            "saldo": 50
          },
          {
            "code": "2112-8",
            "saldo": 30
          },
          {
            "code": "2112-85",
            "saldo": 30
          },
          {
            "code": "2112-17",
            "saldo": 20
          },
          {
            "code": "2112-34",
            "saldo": 19.56
          },
          {
            "code": "2112-23",
            "saldo": 10
          },
          {
            "code": "2112-80",
            "saldo": 0.95
          },
          {
            "code": "2112-126",
            "saldo": 0.84
          },
          {
            "code": "2112-35",
            "saldo": 0.01
          },
          {
            "code": "2112-127",
            "saldo": 0.01
          }
        ],
        "largest": [
          {
            "code": "2112-91",
            "saldo": 3400
          },
          {
            "code": "2112-20",
            "saldo": 2606.34
          },
          {
            "code": "2112-76",
            "saldo": 2490
          },
          {
            "code": "2112-102",
            "saldo": 2440.53
          },
          {
            "code": "2112-77",
            "saldo": 2080
          },
          {
            "code": "2112-136",
            "saldo": 2035
          },
          {
            "code": "2112-2",
            "saldo": 1940
          },
          {
            "code": "2112-141",
            "saldo": 1745
          },
          {
            "code": "2112-271",
            "saldo": 1620
          },
          {
            "code": "2112-106",
            "saldo": 1500
          }
        ]
      }
    },
    {
      "id": "IDSS|bruto-bilans|31.10.2026|IDSS-BRUTO-BILANS-31102026.pdf",
      "entity": "IDSS",
      "entityName": "PU I D S S Buka 13",
      "jib": "4202220420007",
      "periodFrom": "1.01.2026",
      "periodTo": "31.10.2026",
      "printedAt": "9.11.2026",
      "fileName": "IDSS-BRUTO-BILANS-31102026.pdf",
      "kind": "bruto-bilans",
      "accountsCount": 439,
      "totals": {
        "d": 5300494.5,
        "p": 5301307.04,
        "saldoD": 1481238.06,
        "saldoP": 1482050.6
      },
      "issues": [
        {
          "severity": "kritično",
          "text": "Bilans nije u ravnoteži: ukupno duguje − potražuje = -812,54 KM.",
          "amount": -812.54
        },
        {
          "severity": "kritično",
          "text": "Salda nisu u ravnoteži: dugovna − potražna salda = -812,54 KM.",
          "amount": -812.54
        },
        {
          "severity": "upozorenje",
          "text": "Prelazni konto 2009 (Transakcijski računi - prelazni konto) nije zatvoren: saldo 150,00 KM.",
          "amount": 150
        },
        {
          "severity": "upozorenje",
          "text": "Prelazni konto 20090 (Prelazni račun Kartica - SPARKASSE) nije zatvoren: saldo -276,81 KM.",
          "amount": -276.81
        },
        {
          "severity": "upozorenje",
          "text": "Prelazni konto 200900 (Prelazni račun - polog pazara) nije zatvoren: saldo -808,34 KM.",
          "amount": -808.34
        },
        {
          "severity": "upozorenje",
          "text": "Analitički konto 4221-110 nema naziv partnera (saldo -23.700,00 KM).",
          "amount": -23700
        }
      ],
      "metrics": {
        "entity": "IDSS",
        "periodTo": "31.10.2026",
        "months": 10,
        "cash": 19470.37,
        "cashInTransit": -935.15,
        "receivablesCustomers": 130500.09,
        "customersDebit": 134259.9,
        "customersCredit": 3759.81,
        "receivablesEmployees": 1052.83,
        "loansToIndividuals": 17402.03,
        "loansToRelated": 31000,
        "equity": -18391.27,
        "bankLoans": 8447.36,
        "overdraft": 5554.04,
        "otherLoans": 16800,
        "leasing": 0,
        "externalDebt": 30801.4,
        "deposits": 13673.88,
        "netSalariesPayable": 49256.53,
        "publicAgreements": 42326.99,
        "publicCurrent": 80680.74,
        "revenue": 907078.46,
        "revenueRelated": 100000,
        "expenses": 807303.2,
        "result": 99775.26,
        "labor": 608418.48,
        "contractsWork": 93117.01,
        "rent": 1681.4,
        "interest": 8041.74,
        "latePaymentInterest": 2242.52,
        "amortization": 0,
        "ministrySubsidies": null
      },
      "customers": {
        "count": 135,
        "debtors": 74,
        "creditors": 8,
        "debitTotal": 134259.9,
        "creditTotal": 3759.81,
        "net": 130500.09,
        "noPayment": [
          {
            "code": "2112-2",
            "saldo": 29650
          },
          {
            "code": "2112-1",
            "saldo": 10500
          },
          {
            "code": "2112-63",
            "saldo": 9450
          },
          {
            "code": "2112-33",
            "saldo": 7325.68
          },
          {
            "code": "2112-71",
            "saldo": 2400
          },
          {
            "code": "2112-79",
            "saldo": 2024.47
          },
          {
            "code": "2112-17",
            "saldo": 1102.5
          },
          {
            "code": "2112-24",
            "saldo": 700
          },
          {
            "code": "2112-242",
            "saldo": 60
          },
          {
            "code": "2112-86",
            "saldo": 50
          },
          {
            "code": "2112-89",
            "saldo": 40.75
          },
          {
            "code": "2112-16",
            "saldo": 13.71
          }
        ],
        "largest": [
          {
            "code": "2112-2",
            "saldo": 29650
          },
          {
            "code": "2112-1",
            "saldo": 10500
          },
          {
            "code": "2112-63",
            "saldo": 9450
          },
          {
            "code": "2112-33",
            "saldo": 7325.68
          },
          {
            "code": "2112-67",
            "saldo": 5370.09
          },
          {
            "code": "2112-39",
            "saldo": 4452.47
          },
          {
            "code": "2112-78",
            "saldo": 3706
          },
          {
            "code": "2112-275",
            "saldo": 3313.34
          },
          {
            "code": "2112-32",
            "saldo": 3078.36
          },
          {
            "code": "2112-72",
            "saldo": 2855.6
          }
        ]
      }
    },
    {
      "id": "IDSS|kartica|2.11.2026|IDSS-Dugovna-Strana-Kupci-02112026.pdf",
      "entity": "IDSS",
      "entityName": "PU I D S S Buka 13",
      "jib": "4202220420007",
      "periodFrom": "1.01.2026",
      "periodTo": "2.11.2026",
      "printedAt": "9.11.2026",
      "fileName": "IDSS-Dugovna-Strana-Kupci-02112026.pdf",
      "kind": "kartica",
      "accountsCount": 139,
      "totals": {
        "d": 1002789.36,
        "p": 881108.1,
        "saldoD": 125443.36,
        "saldoP": 3762.1
      },
      "issues": [],
      "metrics": {
        "entity": "IDSS",
        "periodTo": "2.11.2026",
        "months": 10.1,
        "cash": 0,
        "cashInTransit": 0,
        "receivablesCustomers": 121681.26,
        "customersDebit": 125443.36,
        "customersCredit": 3762.1,
        "receivablesEmployees": 0,
        "loansToIndividuals": 0,
        "loansToRelated": 0,
        "equity": null,
        "bankLoans": 0,
        "overdraft": 0,
        "otherLoans": 0,
        "leasing": 0,
        "externalDebt": 0,
        "deposits": 0,
        "netSalariesPayable": 0,
        "publicAgreements": 0,
        "publicCurrent": 0,
        "revenue": null,
        "revenueRelated": 0,
        "expenses": null,
        "result": null,
        "labor": null,
        "contractsWork": null,
        "rent": null,
        "interest": null,
        "latePaymentInterest": null,
        "amortization": null,
        "ministrySubsidies": null
      },
      "customers": {
        "count": 135,
        "debtors": 69,
        "creditors": 10,
        "debitTotal": 125443.36,
        "creditTotal": 3762.1,
        "net": 121681.26,
        "noPayment": [
          {
            "code": "2112-2",
            "saldo": 29650
          },
          {
            "code": "2112-1",
            "saldo": 10500
          },
          {
            "code": "2112-63",
            "saldo": 9450
          },
          {
            "code": "2112-33",
            "saldo": 7325.68
          },
          {
            "code": "2112-71",
            "saldo": 2400
          },
          {
            "code": "2112-79",
            "saldo": 2024.47
          },
          {
            "code": "2112-17",
            "saldo": 1102.5
          },
          {
            "code": "2112-24",
            "saldo": 700
          },
          {
            "code": "2112-242",
            "saldo": 60
          },
          {
            "code": "2112-86",
            "saldo": 50
          },
          {
            "code": "2112-89",
            "saldo": 40.75
          },
          {
            "code": "2112-16",
            "saldo": 13.71
          }
        ],
        "largest": [
          {
            "code": "2112-2",
            "saldo": 29650
          },
          {
            "code": "2112-1",
            "saldo": 10500
          },
          {
            "code": "2112-63",
            "saldo": 9450
          },
          {
            "code": "2112-33",
            "saldo": 7325.68
          },
          {
            "code": "2112-67",
            "saldo": 5370.09
          },
          {
            "code": "2112-39",
            "saldo": 4452.47
          },
          {
            "code": "2112-78",
            "saldo": 3706
          },
          {
            "code": "2112-275",
            "saldo": 3313.34
          },
          {
            "code": "2112-32",
            "saldo": 3078.36
          },
          {
            "code": "2112-72",
            "saldo": 2855.6
          }
        ]
      }
    }
  ],
  "recon": [
    {
      "label": "Fakture IMH → IDSS (zajednički troškovi): fakturisano",
      "imh": 132083.6,
      "idss": 125786.55,
      "diff": 6297.05,
      "note": "IMH kupac IDSS (duguje) vs IDSS dobavljač IMH (potražuje)"
    },
    {
      "label": "Fakture IMH → IDSS: plaćeno",
      "imh": 136279.95,
      "idss": 136279.95,
      "diff": 0,
      "note": "IMH naplaćeno vs IDSS plaćeno"
    },
    {
      "label": "Fakture IDSS → IMH (kredit MF Banke): fakturisano",
      "idss": 100000,
      "imh": 100000,
      "diff": 0,
      "note": "IDSS kupac IMH vs IMH dobavljač IDSS"
    },
    {
      "label": "Fakture IDSS → IMH: plaćeno",
      "idss": 100000,
      "imh": 87800,
      "diff": 12200,
      "note": "IDSS naplaćeno vs IMH plaćeno"
    },
    {
      "label": "Zajam IDSS → IMH",
      "idss": 31000,
      "imh": 31000,
      "diff": 0,
      "note": "IDSS 24020 vs IMH obaveze prema IDSS"
    },
    {
      "label": "Zajam IMH → IDSS",
      "imh": 2600,
      "idss": 2600,
      "diff": 0,
      "note": "IMH 24020 vs IDSS krediti od IMH"
    },
    {
      "label": "Avans IDSS-a IMH-u (knjige)",
      "idss": 32150.02,
      "imh": null,
      "diff": 32150.02,
      "note": "Nema protustavke u IMH-u"
    }
  ]
};
