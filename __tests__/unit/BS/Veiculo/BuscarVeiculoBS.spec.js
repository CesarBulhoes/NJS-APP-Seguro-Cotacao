const { BuscarVeiculoBS } = require('../../../../src/BS/Veiculo');
const BuscarVeiculoSerializer = require('../../../../src/Serializers/Veiculo');
const { InvalidRequestError, InternalServerError } = require('../../../../src/Utils/Errors');
const { RequestValidator, ObterListaSemDuplicatas } = require('../../../../src/Utils/Helpers');
const { AutoApi } = require('../../../../src/Utils/Wiz');

const construirSut = () => ({ sut: BuscarVeiculoBS });

describe('Considerando o SolicitarCotacaoBS', () => {
  describe('E a função buscar é chamada', () => {
    let validadorSpy;

    beforeEach(() => {
      validadorSpy = jest.spyOn(RequestValidator.prototype, 'validate').mockImplementation((data) => {
        validadorSpy.mock.calls.push(data);
        return { value: data };
      });
    });

    afterEach(() => {
      validadorSpy.mockRestore();
    });

    test('E a função validate de RequestValidator retorne a propiedade erro', async () => {
      const validadorSpyComErro = jest.spyOn(RequestValidator.prototype, 'validate').mockImplementation((data) => {
        validadorSpyComErro.mock.calls.push(data);
        return { erro: 'qualquer_erro' };
      });

      const { sut } = construirSut();
      const fakeData = { invalidKey: 'any_value' };
      const resposta = await sut.buscar(fakeData);

      expect(validadorSpyComErro).toHaveBeenCalled();
      expect(validadorSpyComErro.mock.calls[0][0]).toEqual(fakeData);
      expect(resposta.statusCode).toBe(400);
      expect(resposta.body).toEqual({
        error: new InvalidRequestError(new RequestValidator().validate(fakeData).erro).message
      });

      validadorSpyComErro.mockRestore();
    });

    test('E a função buscarVeiculo de AutoApi lanca um erro', async () => {
      const autoApiBuscarVeiculoSpyComErro = jest.spyOn(AutoApi, 'buscarVeiculo').mockImplementation((data) => {
        autoApiBuscarVeiculoSpyComErro.mock.calls.push(data);
        throw new Error('qualquer erro');
      });

      const { sut } = construirSut();
      const fakeData = { placa: 'qualquer_placa' };
      const resposta = await sut.buscar(fakeData);

      expect(autoApiBuscarVeiculoSpyComErro).toHaveBeenCalled();
      expect(autoApiBuscarVeiculoSpyComErro.mock.calls[0][0]).toEqual(validadorSpy.mock.results[0].value.value.placa);
      expect(resposta.statusCode).toBe(500);
      expect(resposta.body).toEqual({ error: new InternalServerError().message });

      autoApiBuscarVeiculoSpyComErro.mockRestore();
    });

    test('E a funcao buscar é executada com sucesso', async () => {
      const autoApiBuscarVeiculoSpy = jest.spyOn(AutoApi, 'buscarVeiculo').mockImplementation((data) => {
        autoApiBuscarVeiculoSpy.mock.calls.push(data);
        return [
          {
            branch: 'qualquer_branch01',
            model: 'qualquer_model01',
            color: 'qualquer_color01',
            description: 'qualquer_description01',
            category: 'qualquer_category01',
            fuel: 'qualquer_fuel01',
            manufactureYear: 'qualquer_manufactureYear01',
            modelYear: 'qualquer_modelYear01',
            plate: 'qualquer_plate01',
            age: 'qualquer_age01'
          },
          {
            branch: 'qualquer_branch01',
            model: 'qualquer_model01',
            color: 'qualquer_color01',
            description: 'qualquer_description01',
            category: 'qualquer_category01',
            fuel: 'qualquer_fuel01',
            manufactureYear: 'qualquer_manufactureYear01',
            modelYear: 'qualquer_modelYear01',
            plate: 'qualquer_plate01',
            age: 'qualquer_age01'
          },
          {
            branch: 'qualquer_branch02',
            model: 'qualquer_model01',
            color: 'qualquer_color01',
            description: 'qualquer_description01',
            category: 'qualquer_category01',
            fuel: 'qualquer_fuel01',
            manufactureYear: 'qualquer_manufactureYear01',
            modelYear: 'qualquer_modelYear01',
            plate: 'qualquer_plate01',
            age: 'qualquer_age01'
          }
        ];
      });

      const { sut } = construirSut();
      const fakeData = { placa: 'qualquer_placa' };
      const resposta = await sut.buscar(fakeData);

      expect(resposta.statusCode).toBe(200);
      expect(resposta.body).toEqual(
        ObterListaSemDuplicatas.obter(
          BuscarVeiculoSerializer.serializeLista(autoApiBuscarVeiculoSpy.mock.results[0].value)
        )
      );
    });
  });
});
