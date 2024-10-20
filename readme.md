# Amazon Price to ARS Converter

## Secciones

 - [Descripción](#descripción)
 - [Características](#características)
 - [Instalación en Chrome](#instalación-en-chrome)
 - [¿Cómo se usa? 🚀](#uso)

## Descripción

Esta extensión convierte automáticamente el precio mostrado en Amazon (en dólares) a pesos argentinos, aplicando los valores de cambio correspondientes. Utiliza los valores del dólar MEP (dólar bolsa) o del dólar tarjeta, obtenidos de APIs externas, y calcula el precio final en ARS con los impuestos incluidos.

### Características:

- Conversión en tiempo real de precios de Amazon en USD a pesos argentinos (ARS).
- Selección del tipo de cambio: dólar MEP o dólar tarjeta.
- Respaldo de valores en `localStorage` para casos donde la API no esté disponible.
- Actualización automática de los valores de las tasas de cambio al conectar con la API.


## Instalación en Chrome

- Descargar este repo:
   ![repo_download_screenshot](/Docs/Chrome_setup/images/repo_download.png)

- Descomprimir/extraer, por ejemplo en:
    ```bash
    C:\Descargas\Extension-Amazon-main
    ```

- Abrir panel de administración de extensiones de Chrome:

   ![chrome_extensions_screenshot_01](/Docs/Chrome_setup/images/chrome_extensions_01.png)

- Activar "Modo de desarrollador" (en caso que estuviera desactivado), y luego clickear en "Cargar extensión sin empaquetar":

   ![chrome_extensions_screenshot_02](/Docs/Chrome_setup/images/chrome_extensions_02.png)

- Especificar la ubicación de la carpeta "Chrome" extraída, ejemplo:

   ![chrome_extensions_screenshot_03](/Docs/Chrome_setup/images/chrome_extensions_03.png)

- Anclar la extensión a la barra de Chrome:

   ![chrome_extensions_screenshot_04](/Docs/Chrome_setup/images/chrome_extensions_04.png)

- Verificar que una vez anclada aparece la bandera, 
junto a las demás ancladas:

   ![chrome_extensions_screenshot_05](/Docs/Chrome_setup/images/chrome_extensions_05.png)


## Uso

- Navegar a la página de cualquier producto
    - Ejemplo:
        - https://www.amazon.com/-/es/Transformers-her%C3%B3icos-juguetes-Optimus-atemporal/dp/B077YYP739
- Clickear en la extensión una vez para activarla
- Clickear en "Detalles" para ver a la extensión hacer su magia 🧙🏻‍♀️
    - Antes:

       ![chrome_extensions_screenshot_06](/Docs/Chrome_setup/images/chrome_extensions_06.png)

    - Después:

       ![chrome_extensions_screenshot_07](/Docs/Chrome_setup/images/chrome_extensions_07.png)
