const { GetCurrentDate } = require('../../../../src/Utils/Helpers');

module.exports = {
  quotationRequestId: 'qualquer_quotationRequestId',
  createDate: GetCurrentDate.get(),
  updateDate: GetCurrentDate.get(),
  provider: {
    name: 'qualquer_name'
  },
  insuranceNetPremium: 'qualquer_insuranceNetPremium',
  insurancePremium: 'qualquer_insurancePremium',
  iof: 'qualquer_iof',
  paymentMethods: [
    {
      typy: {
        id: 'qualquer_id',
        name: 'qualquer_name',
        description: 'qualquer_description'
      },
      description: 'qualquer_description',
      code: 'qualquer_code',
      installmentOptions: [
        {
          description: 'qualquer_description',
          totalAmount: 'qualquer_totalAmount',
          interestAmount: 'qualquer_interestAmount',
          iof: 'qualquer_iof',
          valueOfTheFirstInstallment: 'qualquer_valueOfTheFirstInstallment',
          valueOfTheLastInstallment: 'qualquer_valueOfTheLastInstallment',
          totalOfInstallments: 'qualquer_totalOfInstallments'
        }
      ]
    }
  ],
  data: {
    code: 'qualquer_code',
    id: 'qualquer_id',
    quotationDate: GetCurrentDate.get(),
    quotationDueDate: GetCurrentDate.get(),
    startDate: GetCurrentDate.get(),
    endDate: GetCurrentDate.get(),
    insuranceNetPremium: 'qualquer_insuranceNetPremium',
    iof: 'qualquer_iof',
    insurancePremium: 'qualquer_insurancePremium',
    vehicle: {
      chassisCode: 'qualquer_chassisCode',
      branch: 'qualquer_branch',
      code: 'qualquer_code',
      model: 'qualquer_modelo',
      color: 'qualquer_cor',
      description: 'qualquer_dercription',
      category: 'qualquer_category',
      fuel: 'qualquer_fuel',
      manufactureYear: 'qualquer_manufactureYear',
      modelYear: 'qualquer_modelYear',
      plate: 'qualquer_plate',
      age: 'qualquer_age'
    },
    fipePercentageUsed: 'qualquer_fipePercentageUsed',
    overnightStay: {
      zipcode: 'qualquer_zipcode',
      addressName: 'qualquer_addressName',
      complement: 'qualquer_complement',
      neighborhood: 'qualquer_neighborhood',
      city: 'qualquer_city',
      stateProvince: 'qualquer_stateProvince'
    },
    deductibleAmount: 'qualquer_deductibleAmount',
    coverages: [
      {
        code: 'qualquer_code',
        name: 'qualquer_name',
        description: 'qualquer_description',
        deductible: {
          code: 'qualquer_code',
          description: 'qualquer_description',
          data: 'qualquer_data'
        },
        guarantees: [
          {
            code: 'qualquer_code',
            name: 'qualquer_name',
            description: 'qualquer_drescription',
            premiumValue: 'qualquer_premiumValue',
            deductibleValue: 'qualquer_deductibleValue',
            data: 'qualquer_data'
          }
        ],
        additionals: [
          {
            code: 'qualquer_code',
            name: 'qualquer_name',
            description: 'qualquer_drescription',
            premiumValue: 'qualquer_premiumValue',
            deductibleValue: 'qualquer_deductibleValue',
            data: 'qualquer_data'
          }
        ]
      }
    ],
    questionnaire: [
      {
        fieldCode: 'qualquer_fieldCode',
        fieldName: 'qualquer_fieldName',
        fieldDescription: 'qualquer_fieldDescription',
        answer: 'qualquer_answer'
      }
    ]
  }
};
