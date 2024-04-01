import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EthereumService } from '../../service/ethereum.service';
import { MatButton } from '@angular/material/button';
import { GraphqlService } from '../../service/graphql.service';

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [
    CommonModule,
    MatButton
  ],
  templateUrl: './withdraw.voucher.component.html',
  styleUrl: './withdraw.voucher.component.less'
})
export class WithdrawVoucherComponent {

  voucher: any
  loaded = false
  executed = false

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private ethereumService: EthereumService,
  private graphqlService: GraphqlService) {
  }

  async ngAfterViewInit() {
    await this.ethereumService.initEthereum();
    this.executed = await this.ethereumService.wasVoucherExecuted(this.data.input.index, this.data.index)
    this.voucher = await this.graphqlService.getVoucherWithProof(this.data.index, this.data.input.index)
    this.loaded = true
  }

  async execute() {
    let voucher = await this.graphqlService.getVoucherWithProof(this.data.index, this.data.input.index)
    await this.ethereumService.initEthereum();
    await this.ethereumService.voucherExecuteCall(voucher.destination, voucher.payload, voucher.proof)
  }
}
